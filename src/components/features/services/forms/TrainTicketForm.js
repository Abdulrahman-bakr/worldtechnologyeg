

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { FloatingInput } from '../../../ui/forms/FloatingInput.js';
import { SwitchVerticalIcon, ChevronDownIcon } from '../../../icons/index.js';
import { StationSelectionModal } from '../../../ui/modals/StationSelectionModal.js';
import { FLATTENED_EGYPT_TRAIN_STATIONS } from '../../../../constants/index.js';

const ARABIC_MONTHS = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];

const TrainTicketForm = ({ product, onInitiateDirectCheckout }) => {
    const [formData, setFormData] = useState({});
    const [formError, setFormError] = useState('');
    const [departureSearchQuery, setDepartureSearchQuery] = useState('');
    const [arrivalSearchQuery, setArrivalSearchQuery] = useState('');
    const [departureSuggestions, setDepartureSuggestions] = useState([]);
    const [arrivalSuggestions, setArrivalSuggestions] = useState([]);
    const [selectedDepartureStation, setSelectedDepartureStation] = useState(null);
    const [selectedArrivalStation, setSelectedArrivalStation] = useState(null);
    const [isDepartureSuggestionsVisible, setIsDepartureSuggestionsVisible] = useState(false);
    const [isArrivalSuggestionsVisible, setIsArrivalSuggestionsVisible] = useState(false);
    const [trainTravelDate, setTrainTravelDate] = useState('');
    const [trainTravelYear, setTrainTravelYear] = useState('');
    const [trainTravelMonth, setTrainTravelMonth] = useState('');
    const [trainTravelDay, setTrainTravelDay] = useState('');
    const [isStationModalOpen, setIsStationModalOpen] = useState(false);
    const [stationModalTarget, setStationModalTarget] = useState(null);
    const departureSearchRef = useRef(null);
    const arrivalSearchRef = useRef(null);

    const selectClassName = "w-full p-2.5 rounded-md border border-light-300 dark:border-dark-600 bg-white dark:bg-dark-700 text-dark-900 dark:text-dark-50 focus:ring-primary focus:border-primary transition-colors";
    const labelClassName = "block text-sm font-medium mb-1 text-dark-800 dark:text-dark-100";


    useEffect(() => {
        setTrainTravelDate(trainTravelYear && trainTravelMonth && trainTravelDay ? `${trainTravelYear}-${String(trainTravelMonth).padStart(2, '0')}-${String(trainTravelDay).padStart(2, '0')}` : '');
    }, [trainTravelYear, trainTravelMonth, trainTravelDay]);

    const availableDates = useMemo(() => {
        const nowInEgypt = new Date(new Date().toLocaleString('en-US', { timeZone: 'Africa/Cairo' }));
        nowInEgypt.setHours(0, 0, 0, 0);
        const available = { years: new Set(), months: {}, days: {} };
        for (let i = 1; i <= 14; i++) {
            const date = new Date(nowInEgypt);
            date.setDate(nowInEgypt.getDate() + i);
            const year = date.getFullYear(), month = date.getMonth() + 1, day = date.getDate();
            available.years.add(year);
            if (!available.months[year]) available.months[year] = new Set();
            available.months[year].add(month);
            const monthKey = `${year}-${month}`;
            if (!available.days[monthKey]) available.days[monthKey] = new Set();
            available.days[monthKey].add(day);
        }
        return {
            years: Array.from(available.years).sort(),
            months: (year) => year && available.months[year] ? Array.from(available.months[year]).sort((a,b) => a-b) : [],
            days: (year, month) => (year && month && available.days[`${year}-${month}`]) ? Array.from(available.days[`${year}-${month}`]).sort((a,b) => a-b) : []
        };
    }, []);
    
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (departureSearchRef.current && !departureSearchRef.current.contains(event.target)) setIsDepartureSuggestionsVisible(false);
            if (arrivalSearchRef.current && !arrivalSearchRef.current.contains(event.target)) setIsArrivalSuggestionsVisible(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearchChange = (e, type) => {
        const query = e.target.value;
        const setQuery = type === 'departure' ? setDepartureSearchQuery : setArrivalSearchQuery;
        const setStation = type === 'departure' ? setSelectedDepartureStation : setSelectedArrivalStation;
        const setSuggestions = type === 'departure' ? setDepartureSuggestions : setArrivalSuggestions;
        const setVisible = type === 'departure' ? setIsDepartureSuggestionsVisible : setIsArrivalSuggestionsVisible;
        
        setQuery(query);
        setStation(null);
        if (query.length > 1) {
            setSuggestions(FLATTENED_EGYPT_TRAIN_STATIONS.filter(s => s.name.toLowerCase().includes(query.toLowerCase())).slice(0, 5));
            setVisible(true);
        } else {
            setSuggestions([]);
            setVisible(false);
        }
    };
    
    const handleSuggestionClick = (station, type) => {
        if (type === 'departure') {
            setSelectedDepartureStation(station);
            setDepartureSearchQuery(station.name);
            setIsDepartureSuggestionsVisible(false);
        } else {
            setSelectedArrivalStation(station);
            setArrivalSearchQuery(station.name);
            setIsArrivalSuggestionsVisible(false);
        }
    };
    
    const handleSwapStations = () => {
        setSelectedDepartureStation(selectedArrivalStation);
        setSelectedArrivalStation(selectedDepartureStation);
        setDepartureSearchQuery(arrivalSearchQuery);
        setArrivalSearchQuery(departureSearchQuery);
    };

    const handleOpenStationModal = (target) => {
        setStationModalTarget(target);
        setIsStationModalOpen(true);
    };

    const handleStationSelectFromModal = (station) => {
        if (stationModalTarget === 'departure') {
            setSelectedDepartureStation(station);
            setDepartureSearchQuery(station.name);
        } else if (stationModalTarget === 'arrival') {
            setSelectedArrivalStation(station);
            setArrivalSearchQuery(station.name);
        }
        setIsStationModalOpen(false);
    };

    const showPassengerDetails = selectedDepartureStation && selectedArrivalStation && trainTravelDate;
    const isCheckoutDisabled = !showPassengerDetails || !formData.trainNumber || !formData.nationalId || formData.nationalId.length !== 14 || !formData.passengerName;

    return React.createElement(React.Fragment, null,
        React.createElement("form", {
            onSubmit: (e) => { 
                e.preventDefault();
                const formattedDate = new Date(trainTravelYear, trainTravelMonth - 1, trainTravelDay).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'Africa/Cairo' });
                onInitiateDirectCheckout(product, {
                    formData: [
                        { label: 'محطة المغادرة', value: selectedDepartureStation.name },
                        { label: 'محطة الوصول', value: selectedArrivalStation.name },
                        { label: 'تاريخ السفر', value: formattedDate },
                        { label: 'رقم القطار', value: formData.trainNumber },
                        { label: 'اسم القطار', value: formData.trainName || 'غير محدد' },
                        { label: 'اسم الراكب', value: formData.passengerName },
                        { label: 'الرقم القومي', value: formData.nationalId },
                    ],
                    finalPrice: 0 // Price is unknown
                });
             },
            className: "space-y-4"
        },
            React.createElement("h3", { className: "text-lg font-semibold text-dark-900 dark:text-dark-50 mb-3 text-center" }, product.arabicName),
            React.createElement("div", { className: "flex flex-col md:flex-row items-center gap-4 md:gap-3" },
                React.createElement("div", { className: "flex items-stretch gap-2 w-full md:flex-1" },
                    React.createElement("div", { className: "relative flex-grow", ref: departureSearchRef },
                        React.createElement(FloatingInput, { id: "departureStation", value: departureSearchQuery, onChange: (e) => handleSearchChange(e, 'departure'), placeholder: "من (محطة) *" }),
                        isDepartureSuggestionsVisible && departureSuggestions.length > 0 && React.createElement("ul", { className: "absolute top-full mt-1 w-full bg-white dark:bg-dark-700 border border-light-300 dark:border-dark-600 rounded-lg shadow-lg z-10" },
                            departureSuggestions.map(station => React.createElement("li", { key: station.name, onClick: () => handleSuggestionClick(station, 'departure'), className: "px-4 py-2 cursor-pointer hover:bg-light-100 dark:hover:bg-dark-600" }, station.name))
                        )
                    ),
                    React.createElement("button", { 
                        type: "button", 
                        onClick: () => handleOpenStationModal('departure'), 
                        className: "flex-shrink-0 px-4 bg-white dark:bg-dark-700 border border-light-300 dark:border-dark-600 rounded-lg text-dark-600 dark:text-dark-300 hover:bg-light-100 dark:hover:bg-dark-600 transition-colors flex items-center justify-center", 
                        "aria-label": "اختر محطة القيام" 
                    }, React.createElement(ChevronDownIcon, { className: "w-5 h-5" }))
                ),
                React.createElement("button", { type: "button", onClick: handleSwapStations, "aria-label": "تبديل المحطات", className: "p-3 rounded-full bg-white dark:bg-dark-700 border border-light-300 dark:border-dark-600 text-dark-700 dark:text-dark-100 hover:bg-light-100 dark:hover:bg-dark-600 transition-colors" }, React.createElement(SwitchVerticalIcon, { className: "w-6 h-6" })),
                React.createElement("div", { className: "flex items-stretch gap-2 w-full md:flex-1" },
                    React.createElement("div", { className: "relative flex-grow", ref: arrivalSearchRef },
                        React.createElement(FloatingInput, { id: "arrivalStation", value: arrivalSearchQuery, onChange: (e) => handleSearchChange(e, 'arrival'), placeholder: "إلى (محطة) *" }),
                        isArrivalSuggestionsVisible && arrivalSuggestions.length > 0 && React.createElement("ul", { className: "absolute top-full mt-1 w-full bg-white dark:bg-dark-700 border border-light-300 dark:border-dark-600 rounded-lg shadow-lg z-10" },
                            arrivalSuggestions.map(station => React.createElement("li", { key: station.name, onClick: () => handleSuggestionClick(station, 'arrival'), className: "px-4 py-2 cursor-pointer hover:bg-light-100 dark:hover:bg-dark-600" }, station.name))
                        )
                    ),
                    React.createElement("button", { 
                        type: "button", 
                        onClick: () => handleOpenStationModal('arrival'), 
                        className: "flex-shrink-0 px-4 bg-white dark:bg-dark-700 border border-light-300 dark:border-dark-600 rounded-lg text-dark-600 dark:text-dark-300 hover:bg-light-100 dark:hover:bg-dark-600 transition-colors flex items-center justify-center", 
                        "aria-label": "اختر محطة الوصول" 
                    }, React.createElement(ChevronDownIcon, { className: "w-5 h-5" }))
                )
            ),
            React.createElement("div", null,
                React.createElement("label", { className: labelClassName }, "تاريخ السفر *"),
                React.createElement("div", { className: "grid grid-cols-3 gap-2" },
                    React.createElement("select", { value: trainTravelYear, onChange: e => { setTrainTravelYear(e.target.value); setTrainTravelMonth(''); setTrainTravelDay(''); }, className: selectClassName },
                        React.createElement("option", { value: "" }, "السنة"), availableDates.years.map(year => React.createElement("option", { key: year, value: year }, year))),
                    React.createElement("select", { value: trainTravelMonth, onChange: e => { setTrainTravelMonth(e.target.value); setTrainTravelDay(''); }, disabled: !trainTravelYear, className: selectClassName },
                        React.createElement("option", { value: "" }, "الشهر"), availableDates.months(trainTravelYear).map(month => React.createElement("option", { key: month, value: month }, ARABIC_MONTHS[month - 1]))),
                    React.createElement("select", { value: trainTravelDay, onChange: e => setTrainTravelDay(e.target.value), disabled: !trainTravelMonth, className: selectClassName },
                        React.createElement("option", { value: "" }, "اليوم"), availableDates.days(trainTravelYear, trainTravelMonth).map(day => React.createElement("option", { key: day, value: day }, day)))
                )
            ),
            showPassengerDetails && React.createElement("div", { className: "space-y-4 pt-4 border-t" },
                React.createElement(FloatingInput, { id: "trainNumber", value: formData.trainNumber || '', onChange: (e) => setFormData(p => ({...p, trainNumber: e.target.value})), placeholder: "رقم القطار *" }),
                React.createElement(FloatingInput, { id: "trainName", value: formData.trainName || '', onChange: (e) => setFormData(p => ({...p, trainName: e.target.value})), placeholder: "اسم القطار (اختياري)" }),
                React.createElement(FloatingInput, { id: "passengerName", value: formData.passengerName || '', onChange: (e) => setFormData(p => ({...p, passengerName: e.target.value})), placeholder: "اسم الراكب *" }),
                React.createElement(FloatingInput, { id: "nationalId", value: formData.nationalId || '', onChange: (e) => setFormData(p => ({...p, nationalId: e.target.value.replace(/\D/g, '')})), placeholder: "الرقم القومي (14 رقم) *", type: "tel", maxLength: 14 })
            ),
            formError && React.createElement("p", { className: "text-red-500 text-sm mt-1 text-center" }, formError),
            React.createElement("div", { className: "pt-4 border-t mt-auto" },
                React.createElement("p", { className: "text-xs text-center text-dark-600 mb-3" }, "سيتم التواصل معك عبر واتساب لتأكيد تفاصيل الحجز والسعر النهائي."),
                React.createElement("button", {
                    type: "submit", disabled: isCheckoutDisabled,
                    className: "w-full bg-primary hover:bg-primary-hover text-white font-semibold py-2.5 px-4 rounded-lg disabled:opacity-60"
                }, "إرسال طلب الحجز")
            )
        ),
        isStationModalOpen && React.createElement(StationSelectionModal, {
            isOpen: isStationModalOpen,
            onClose: () => setIsStationModalOpen(false),
            onStationSelect: handleStationSelectFromModal,
            stations: FLATTENED_EGYPT_TRAIN_STATIONS,
            target: stationModalTarget
        })
    );
};

export { TrainTicketForm };