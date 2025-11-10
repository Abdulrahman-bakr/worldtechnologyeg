import React from 'react';

const FooterAbout = () => {
    return (
        React.createElement("div", { className: "lg:col-span-1 space-y-4" },
            React.createElement("div", { className: "mb-4" },
                React.createElement("h3", { 
                    className: "text-2xl font-bold text-primary mb-3"
                }, "World Technology"),
                React.createElement("div", { 
                    className: "w-20 h-1 bg-gradient-to-r from-primary to-secondary rounded-full mt-2"
                })
            ),
            React.createElement("p", { 
                className: "text-sm text-dark-700 dark:text-dark-200 leading-relaxed mb-4" 
            }, "متجرك الأول لأفضل اكسسوارات الموبايل والأجهزة الإلكترونية. جودة عالية بأسعار تنافسية وخدمة عملاء مميزة."),
            
            React.createElement("div", { className: "flex items-center gap-3 text-sm text-dark-600 dark:text-dark-300" },
                React.createElement("div", { 
                    className: "flex items-center gap-2 bg-green-50 dark:bg-green-900/20 px-3 py-1.5 rounded-full"
                },
                    React.createElement("div", { 
                        className: "w-2 h-2 bg-green-500 rounded-full animate-pulse" 
                    }),
                    React.createElement("span", { 
                        className: "font-medium text-green-700 dark:text-green-300" 
                    }, "متصل الآن")
                ),
                React.createElement("div", { 
                    className: "flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 px-3 py-1.5 rounded-full"
                },
                    React.createElement("svg", { 
                        xmlns: "http://www.w3.org/2000/svg", 
                        viewBox: "0 0 24 24", 
                        fill: "currentColor", 
                        className: "w-3 h-3 text-blue-600 dark:text-blue-400" 
                    },
                        React.createElement("path", { 
                            d: "M12 15a3 3 0 100-6 3 3 0 000 6z" 
                        }),
                        React.createElement("path", { 
                            fillRule: "evenodd", 
                            d: "M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 010-1.113zM17.25 12a5.25 5.25 0 11-10.5 0 5.25 5.25 0 0110.5 0z",
                            clipRule: "evenodd" 
                        })
                    ),
                    React.createElement("span", { 
                        className: "font-medium text-blue-700 dark:text-blue-300" 
                    }, "24/7")
                )
            )
        )
    );
};

export { FooterAbout };