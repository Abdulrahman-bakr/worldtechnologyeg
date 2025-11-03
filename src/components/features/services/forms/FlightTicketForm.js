import React, { useState, useMemo, useEffect, useRef } from 'react';
import { FloatingInput } from '../../../ui/forms/FloatingInput.js';
import { FlightDatesIcon, MapPinIcon, UserIcon, PaperAirplaneIcon, PlaneIcon, ArrowRightIcon, GlobeIcon, SwitchVerticalIcon } from '../../../icons/index.js';
import { AIRPORTS_DATA, COUNTRIES_WITH_AIRPORTS_LIST } from '../../../../constants/airports.js';

export const FlightTicketForm = ({ product, onInitiateDirectCheckout }) => {
    const [tripType, setTripType] = useState('one-way');
    const [departureDate, setDepartureDate] = useState('');
    const [returnDate, setReturnDate] = useState('');
    const [departureCountry, setDepartureCountry] = useState('جمهورية مصر العربية');
    const [departureAirport, setDepartureAirport] = useState('');
    const [arrivalCountry, setArrivalCountry] = useState('');
    const [arrivalAirport, setArrivalAirport] = useState('');
    const [passengerName, setPassengerName] = useState('');
    const [airlinePreference, setAirlinePreference] = useState('');
    const [formError, setFormError] = useState('');

    const departureAirports = useMemo(() => AIRPORTS_DATA[departureCountry] || [], [departureCountry]);
    const arrivalAirports = useMemo(() => AIRPORTS_DATA[arrivalCountry] || [], [arrivalCountry]);

    useEffect(() => {
        setDepartureAirport('');
    }, [departureCountry]);

    useEffect(() => {
        setArrivalAirport('');
    }, [arrivalCountry]);

    const handleSwapStations = () => {
        const tempCountry = departureCountry;
        const tempAirport = departureAirport;
        setDepartureCountry(arrivalCountry);
        setDepartureAirport(arrivalAirport);
        setArrivalCountry(tempCountry);
        setArrivalAirport(tempAirport);
    };
    
    const isCheckoutDisabled = !tripType || !departureDate || (tripType === 'round-trip' && !returnDate) || !departureAirport || !arrivalAirport || !passengerName;

    const handleCheckout = (e) => {
        e.preventDefault();
        if (isCheckoutDisabled) {
            setFormError("يرجى ملء جميع الحقول المطلوبة (*).");
            return;
        }
        setFormError('');

        const selectedDepartureStation = departureAirports.find(a => a.code === departureAirport);
        const selectedArrivalStation = arrivalAirports.find(a => a.code === arrivalAirport);
        
        const getCleanAirportName = (name) => name.replace(/\s*\([^)]*\)$/, '').trim();

        onInitiateDirectCheckout(product, {
            finalPrice: 0, // Price is determined via WhatsApp
            formData: [
                { label: 'نوع الرحلة', value: tripType === 'round-trip' ? 'ذهاب وعودة' : 'ذهاب فقط' },
                { label: 'تاريخ الذهاب', value: new Date(departureDate).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' }) },
                ...(tripType === 'round-trip' ? [{ label: 'تاريخ العودة', value: new Date(returnDate).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' }) }] : []),
                { label: 'من دولة', value: departureCountry },
                { label: 'من مطار', value: getCleanAirportName(selectedDepartureStation.name) },
                { label: 'إلى دولة', value: arrivalCountry },
                { label: 'إلى مطار', value: getCleanAirportName(selectedArrivalStation.name) },
                { label: 'اسم المسافر', value: passengerName },
                ...(airlinePreference ? [{ label: 'شركة طيران مفضلة', value: airlinePreference }] : [])
            ]
        });
    };

    const today = new Date().toISOString().split('T')[0];

    const labelClass = "block text-sm font-semibold mb-2 text-dark-800 dark:text-dark-100 flex items-center gap-2";
    const selectClass = "w-full p-3.5 rounded-xl border border-light-300 dark:border-dark-600 bg-white dark:bg-dark-700 text-dark-900 dark:text-dark-50 focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200 appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2012%2012%22%3E%3Cpath%20fill%3D%22%236B7280%22%20d%3D%22M3%204l3%203%203-3z%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[length:12px] bg-[right:1rem_center] pr-10";
    const inputClass = "w-full p-3.5 rounded-xl border border-light-300 dark:border-dark-600 bg-white dark:bg-dark-700 text-dark-900 dark:text-dark-50 focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200";

    return (
        React.createElement("form", { onSubmit: handleCheckout, className: "space-y-6" },
            // Header Section
            React.createElement("div", { className: "text-center mb-6" },
                React.createElement("div", { className: "flex items-center justify-center mb-4" },
                    React.createElement("div", { className: "flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg" },
                        React.createElement(PlaneIcon, { className: "w-8 h-8 text-white" })
                    )
                ),
                React.createElement("h3", { className: "text-2xl font-bold text-dark-900 dark:text-white mb-3" }, product.arabicName),
                React.createElement("p", { className: "text-dark-600 dark:text-dark-300 max-w-md mx-auto leading-relaxed" }, "أدخل تفاصيل رحلتك وسنتواصل معك بأفضل الأسعار والمواعيد المتاحة")
            ),

            // Trip Type Selection
            React.createElement("div", { className: "bg-white dark:bg-dark-700 rounded-2xl p-6 border border-light-200 dark:border-dark-600 shadow-elevated" },
                React.createElement("div", { className: "flex items-center gap-4 mb-6" },
                    React.createElement("div", { className: "flex items-center justify-center w-12 h-12 bg-gradient-to-br from-primary/10 to-primary/20 rounded-xl" },
                        React.createElement(ArrowRightIcon, { className: "w-6 h-6 text-primary" })
                    ),
                    React.createElement("div", null,
                        React.createElement("h4", { className: "text-xl font-bold text-dark-900 dark:text-white mb-1" }, "نوع الرحلة"),
                        React.createElement("p", { className: "text-sm text-dark-600 dark:text-dark-300" }, "اختر نوع الرحلة المناسب لك")
                    )
                ),
                React.createElement("div", { className: "grid grid-cols-2 gap-4" },
                    React.createElement("button", { 
                        type: "button", 
                        onClick: () => setTripType('one-way'), 
                        className: `p-4 text-center rounded-xl border-2 transition-all duration-300 transform hover:scale-[1.02] flex flex-col items-center gap-2 ${
                            tripType === 'one-way' 
                                ? 'border-primary bg-gradient-to-r from-primary/5 to-primary/10 shadow-md' 
                                : 'border-light-300 dark:border-dark-600 hover:border-primary/50 hover:bg-light-50 dark:hover:bg-dark-600/50'
                        }` 
                    },
                        React.createElement("div", { className: "flex items-center gap-2" },
                            React.createElement(ArrowRightIcon, { className: "w-6 h-6 transform -rotate-45" })
                        ),
                        React.createElement("span", { className: "font-semibold" }, "ذهاب فقط")
                    ),
                    React.createElement("button", { 
                        type: "button", 
                        onClick: () => setTripType('round-trip'), 
                        className: `p-4 text-center rounded-xl border-2 transition-all duration-300 transform hover:scale-[1.02] flex flex-col items-center gap-2 ${
                            tripType === 'round-trip' 
                                ? 'border-primary bg-gradient-to-r from-primary/5 to-primary/10 shadow-md' 
                                : 'border-light-300 dark:border-dark-600 hover:border-primary/50 hover:bg-light-50 dark:hover:bg-dark-600/50'
                        }` 
                    },
                        React.createElement("div", { className: "flex items-center gap-2" },
                            React.createElement(ArrowRightIcon, { className: "w-5 h-5 transform -rotate-45" }),
                            React.createElement(ArrowRightIcon, { className: "w-5 h-5 transform rotate-[135deg]" })
                        ),
                        React.createElement("span", { className: "font-semibold" }, "ذهاب وعودة")
                    )
                )
            ),

            // Dates Section
            React.createElement("div", { className: "bg-white dark:bg-dark-700 rounded-2xl p-6 border border-light-200 dark:border-dark-600 shadow-elevated" },
                React.createElement("div", { className: "flex items-center gap-4 mb-6" },
                    React.createElement("div", { className: "flex items-center justify-center w-12 h-12 bg-gradient-to-br from-secondary/10 to-secondary/20 rounded-xl" },
                        React.createElement(FlightDatesIcon, { className: "w-6 h-6 text-secondary" })
                    ),
                    React.createElement("div", null,
                        React.createElement("h4", { className: "text-xl font-bold text-dark-900 dark:text-white mb-1" }, "مواعيد الرحلة"),
                        React.createElement("p", { className: "text-sm text-dark-600 dark:text-dark-300" }, "حدد تواريخ السفر")
                    )
                ),
                React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-5" },
                    React.createElement("div", null,
                        React.createElement("label", { htmlFor: "departureDate", className: `${labelClass}` }, 
                            React.createElement(FlightDatesIcon, { className: "w-4 h-4 text-primary" }), 
                            "تاريخ الذهاب *"
                        ),
                        React.createElement("input", { 
                            type: "date", 
                            id: "departureDate", 
                            min: today, 
                            value: departureDate, 
                            onChange: e => setDepartureDate(e.target.value), 
                            className: inputClass 
                        })
                    ),
                    tripType === 'round-trip' && React.createElement("div", null,
                        React.createElement("label", { htmlFor: "returnDate", className: `${labelClass}` }, 
                            React.createElement(FlightDatesIcon, { className: "w-4 h-4 text-primary" }), 
                            "تاريخ العودة *"
                        ),
                        React.createElement("input", { 
                            type: "date", 
                            id: "returnDate", 
                            min: departureDate || today, 
                            value: returnDate, 
                            onChange: e => setReturnDate(e.target.value), 
                            className: inputClass 
                        })
                    )
                )
            ),

            // Airports Section
            React.createElement("div", { className: "bg-white dark:bg-dark-700 rounded-2xl p-6 border border-light-200 dark:border-dark-600 shadow-elevated" },
                React.createElement("div", { className: "flex items-center gap-4 mb-6" },
                    React.createElement("div", { className: "flex items-center justify-center w-12 h-12 bg-gradient-to-br from-purple-500/10 to-purple-500/20 rounded-xl" },
                        React.createElement(GlobeIcon, { className: "w-6 h-6 text-purple-500" })
                    ),
                    React.createElement("div", null,
                        React.createElement("h4", { className: "text-xl font-bold text-dark-900 dark:text-white mb-1" }, "مسار الرحلة"),
                        React.createElement("p", { className: "text-sm text-dark-600 dark:text-dark-300" }, "حدد نقاط الانطلاق والوصول")
                    )
                ),
                 React.createElement("div", { className: "flex flex-col md:flex-row items-center gap-4" },
                    React.createElement("div", { className: "w-full md:flex-1 space-y-4" },
                        React.createElement("div", null,
                            React.createElement("label", { htmlFor: "departureCountry", className: `${labelClass}` }, 
                                React.createElement(MapPinIcon, { className: "w-4 h-4 text-primary" }), 
                                "دولة المغادرة *"
                            ),
                            React.createElement("select", { 
                                id: "departureCountry", 
                                value: departureCountry, 
                                onChange: e => setDepartureCountry(e.target.value), 
                                className: selectClass 
                            }, 
                                COUNTRIES_WITH_AIRPORTS_LIST.map(c => 
                                    React.createElement("option", { key: c, value: c }, c)
                                )
                            )
                        ),
                        React.createElement("div", null,
                            React.createElement("label", { htmlFor: "departureAirport", className: `${labelClass}` }, 
                                React.createElement(MapPinIcon, { className: "w-4 h-4 text-primary" }), 
                                "مطار المغادرة *"
                            ),
                            React.createElement("select", { 
                                id: "departureAirport", 
                                value: departureAirport, 
                                onChange: e => setDepartureAirport(e.target.value), 
                                disabled: !departureCountry, 
                                className: selectClass 
                            },
                                React.createElement("option", { value: "" }, "اختر المطار..."),
                                departureAirports.map(a => 
                                    React.createElement("option", { key: a.code, value: a.code }, a.name)
                                )
                            )
                        )
                    ),
                    React.createElement("button", { 
                        type: "button",
                        onClick: handleSwapStations,
                        "aria-label": "تبديل محطات الذهاب والعودة",
                        className: "p-3 rounded-full bg-light-100 dark:bg-dark-600 border border-light-300 dark:border-dark-500 text-dark-700 dark:text-dark-100 hover:bg-light-200 dark:hover:bg-dark-500 transition-colors transform md:rotate-90"
                    },
                        React.createElement(SwitchVerticalIcon, { className: "w-6 h-6" })
                    ),
                    React.createElement("div", { className: "w-full md:flex-1 space-y-4" },
                        React.createElement("div", null,
                            React.createElement("label", { htmlFor: "arrivalCountry", className: `${labelClass}` }, 
                                React.createElement(MapPinIcon, { className: "w-4 h-4 text-primary" }), 
                                "دولة الوصول *"
                            ),
                            React.createElement("select", { 
                                id: "arrivalCountry", 
                                value: arrivalCountry, 
                                onChange: e => setArrivalCountry(e.target.value), 
                                className: selectClass 
                            }, 
                                React.createElement("option", { value: "" }, "اختر الدولة..."), 
                                COUNTRIES_WITH_AIRPORTS_LIST.map(c => 
                                    React.createElement("option", { key: c, value: c }, c)
                                )
                            )
                        ),
                        React.createElement("div", null,
                            React.createElement("label", { htmlFor: "arrivalAirport", className: `${labelClass}` }, 
                                React.createElement(MapPinIcon, { className: "w-4 h-4 text-primary" }), 
                                "مطار الوصول *"
                            ),
                            React.createElement("select", { 
                                id: "arrivalAirport", 
                                value: arrivalAirport, 
                                onChange: e => setArrivalAirport(e.target.value), 
                                disabled: !arrivalCountry, 
                                className: selectClass 
                            },
                                React.createElement("option", { value: "" }, "اختر المطار..."),
                                arrivalAirports.map(a => 
                                    React.createElement("option", { key: a.code, value: a.code }, a.name)
                                )
                            )
                        )
                    )
                )
            ),

            // Passenger Details Section
            React.createElement("div", { className: "bg-white dark:bg-dark-700 rounded-2xl p-6 border border-light-200 dark:border-dark-600 shadow-elevated" },
                React.createElement("div", { className: "flex items-center gap-4 mb-6" },
                    React.createElement("div", { className: "flex items-center justify-center w-12 h-12 bg-gradient-to-br from-green-500/10 to-green-500/20 rounded-xl" },
                        React.createElement(UserIcon, { className: "w-6 h-6 text-green-500" })
                    ),
                    React.createElement("div", null,
                        React.createElement("h4", { className: "text-xl font-bold text-dark-900 dark:text-white mb-1" }, "بيانات المسافر"),
                        React.createElement("p", { className: "text-sm text-dark-600 dark:text-dark-300" }, "أدخل معلومات المسافر الأساسية")
                    )
                ),
                React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-5" },
                    React.createElement(FloatingInput, { 
                        id: "passengerName", 
                        value: passengerName, 
                        onChange: e => setPassengerName(e.target.value), 
                        placeholder: "اسم المسافر (كما في جواز السفر) *", 
                        icon: UserIcon 
                    }),
                    React.createElement(FloatingInput, { 
                        id: "airlinePreference", 
                        value: airlinePreference, 
                        onChange: e => setAirlinePreference(e.target.value), 
                        placeholder: "شركة طيران مفضلة (اختياري)",
                        icon: PlaneIcon
                    })
                )
            ),

            // Error Message
            formError && React.createElement("div", { 
                className: "p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl" 
            },
                React.createElement("p", { className: "text-red-700 dark:text-red-300 text-sm text-center font-medium" }, formError)
            ),

            // Information Card
            React.createElement("div", { className: "bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-2xl p-5 border border-blue-200 dark:border-blue-700/50" },
                React.createElement("div", { className: "flex gap-4" },
                    React.createElement("div", { className: "flex-shrink-0" }, 
                        React.createElement("div", { className: "flex items-center justify-center w-10 h-10 bg-blue-500 rounded-xl" },
                            React.createElement(PaperAirplaneIcon, { className: "w-5 h-5 text-white" })
                        )
                    ),
                    React.createElement("div", null,
                        React.createElement("h5", { className: "font-bold text-blue-800 dark:text-blue-200 mb-2" }, "معلومة مهمة"),
                        React.createElement("p", { className: "text-blue-700 dark:text-blue-300 text-sm leading-relaxed" }, 
                            "سيتم تحديد السعر والتواصل معك عبر واتساب لتأكيد الحجز. يرجى التأكد من إرسال صورة جواز السفر بعد إرسال الطلب."
                        )
                    )
                )
            ),

            // Submit Button
            React.createElement("div", { className: "pt-4" },
                React.createElement("button", {
                    type: "submit",
                    disabled: isCheckoutDisabled,
                    className: "w-full bg-gradient-to-r from-primary to-secondary hover:from-primary-hover hover:to-secondary-hover text-white font-bold py-4 px-6 rounded-xl text-lg transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 flex items-center justify-center gap-3 shadow-lg"
                },
                    React.createElement(PaperAirplaneIcon, { className: "w-6 h-6" }),
                    "إرسال طلب الحجز"
                ),
                React.createElement("p", { className: "text-xs text-center text-dark-600 dark:text-dark-50 mt-3" }, 
                    "سنقوم بالتواصل معك خلال 24 ساعة لتأكيد تفاصيل حجزك"
                )
            )
        )
    );
};