import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { GoogleGenAI, Modality, Blob } from "@google/genai";
import { StaticPageView } from './Static-Pages/StaticPageView.js';
import { MicrophoneIcon, StopCircleIcon, ClipboardDocumentIcon } from '../components/icons/index.js';
import { useApp } from '../contexts/AppContext.js';

// Helper functions for audio encoding
function encode(bytes) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function createBlob(data) {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    int16[i] = data[i] * 32768;
  }
  return {
    data: encode(new Uint8Array(int16.buffer)),
    mimeType: 'audio/pcm;rate=16000',
  };
}

export const AudioTranscriptionView = () => {
    const { setToastMessage } = useApp();
    const [isRecording, setIsRecording] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [status, setStatus] = useState('Ready');

    const sessionPromiseRef = useRef(null);
    const audioContextRef = useRef(null);
    const mediaStreamRef = useRef(null);
    const scriptProcessorRef = useRef(null);

    const stopRecording = useCallback(() => {
        if (sessionPromiseRef.current) {
            sessionPromiseRef.current.then(session => session.close());
            sessionPromiseRef.current = null;
        }
        if (mediaStreamRef.current) {
            mediaStreamRef.current.getTracks().forEach(track => track.stop());
            mediaStreamRef.current = null;
        }
        if (scriptProcessorRef.current) {
            scriptProcessorRef.current.disconnect();
            scriptProcessorRef.current = null;
        }
        if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
            audioContextRef.current.close();
            audioContextRef.current = null;
        }
        setIsRecording(false);
        setStatus('Stopped');
    }, []);

    useEffect(() => {
        // Cleanup on component unmount
        return () => {
            stopRecording();
        };
    }, [stopRecording]);

    const startRecording = async () => {
        setTranscript('');
        setStatus('Connecting...');
        try {
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                throw new Error("Your browser does not support audio recording.");
            }

            mediaStreamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });
            
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            audioContextRef.current = new AudioContext({ sampleRate: 16000 });

            const source = audioContextRef.current.createMediaStreamSource(mediaStreamRef.current);
            scriptProcessorRef.current = audioContextRef.current.createScriptProcessor(4096, 1, 1);

            scriptProcessorRef.current.onaudioprocess = (audioProcessingEvent) => {
                const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
                const pcmBlob = createBlob(inputData);
                if (sessionPromiseRef.current) {
                    sessionPromiseRef.current.then((session) => {
                        session.sendRealtimeInput({ media: pcmBlob });
                    });
                }
            };
            
            source.connect(scriptProcessorRef.current);
            scriptProcessorRef.current.connect(audioContextRef.current.destination);

            const ai = new GoogleGenAI({ apiKey: process.env.REACT_APP_GOOGLE_AI_API_KEY });
            
            sessionPromiseRef.current = ai.live.connect({
                model: 'gemini-2.5-flash-native-audio-preview-09-2025',
                callbacks: {
                    onopen: () => {
                        setIsRecording(true);
                        setStatus('Listening...');
                    },
                    onmessage: (message) => {
                        if (message.serverContent?.inputTranscription) {
                            const text = message.serverContent.inputTranscription.text;
                            setTranscript(prev => prev + text);
                        }
                    },
                    onerror: (e) => {
                        console.error('Gemini Live API Error:', e);
                        setToastMessage({text: 'An error occurred with the connection. Please try again.', type: 'error'});
                        stopRecording();
                    },
                    onclose: () => {
                        // This might be called when stopRecording is invoked, so avoid recursive state updates
                        if (isRecording) {
                             setStatus('Connection closed.');
                             stopRecording();
                        }
                    },
                },
                config: {
                    inputAudioTranscription: {},
                },
            });

        } catch (err) {
            console.error('Error starting recording:', err);
            let errorMessage = 'Failed to start recording.';
            if (err.name === 'NotAllowedError') {
                errorMessage = 'Microphone access was denied. Please allow microphone access in your browser settings.';
            } else if (err.name === 'NotFoundError') {
                errorMessage = 'No microphone found. Please connect a microphone and try again.';
            }
            setStatus('Error');
            setToastMessage({text: errorMessage, type: 'error'});
            stopRecording();
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(transcript);
        setToastMessage({text: 'تم نسخ النص!', type: 'success'});
    }

    const toggleRecording = () => {
        if (isRecording) {
            stopRecording();
        } else {
            startRecording();
        }
    };

    return (
        React.createElement(StaticPageView, { title: "النسخ الصوتي المباشر", icon: MicrophoneIcon },
            React.createElement(Helmet, null, 
                React.createElement("title", null, "النسخ الصوتي - World Technology")
            ),
            React.createElement("p", { className: "text-center text-dark-700 dark:text-dark-100 mb-6" }, 
                "استخدم قوة الذكاء الاصطناعي لتحويل حديثك إلى نص مكتوب في الوقت الفعلي. اضغط على 'بدء التسجيل' وتحدث بوضوح."
            ),
            React.createElement("div", { className: "max-w-3xl mx-auto space-y-6 flex flex-col items-center" },
                React.createElement("div", { className: `w-full min-h-[200px] p-4 border-2 rounded-lg bg-light-100 dark:bg-dark-700 ${isRecording ? 'border-primary' : 'border-light-300 dark:border-dark-600'}` },
                    transcript 
                        ? React.createElement("p", { className: "text-lg whitespace-pre-wrap" }, transcript)
                        : React.createElement("p", { className: "text-lg text-dark-500 dark:text-dark-400" }, "سيظهر النص المكتوب هنا...")
                ),
                React.createElement("div", { className: "flex items-center gap-4" },
                    React.createElement("button", { 
                        onClick: toggleRecording,
                        className: `flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-white transition-all transform hover:scale-105 shadow-lg ${isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-primary hover:bg-primary-hover'}`
                    },
                        isRecording ? React.createElement(StopCircleIcon, { className: "w-6 h-6" }) : React.createElement(MicrophoneIcon, { className: "w-6 h-6" }),
                        isRecording ? "إيقاف التسجيل" : "بدء التسجيل"
                    ),
                    transcript && React.createElement("button", {
                        onClick: handleCopy,
                        className: "flex items-center gap-2 px-4 py-3 rounded-full font-semibold bg-light-200 dark:bg-dark-600 text-dark-800 dark:text-dark-100 transition-all hover:bg-light-300 dark:hover:bg-dark-500"
                    }, React.createElement(ClipboardDocumentIcon, {className: "w-5 h-5"}), "نسخ"),
                ),
                React.createElement("p", { className: `text-sm font-semibold ${isRecording ? 'text-primary animate-pulse' : 'text-dark-600 dark:text-dark-300'}` }, status)
            )
        )
    );
};