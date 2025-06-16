import React, { createContext, useContext, useState } from 'react';

const CurrencyContext = createContext();

export const CurrencyProvider = ({ children, initialCurrency = 'INR', initialSymbol = '₹', initialHasSalary = false }) => {
    const [currency, setCurrency] = useState(initialCurrency);
    const [currencySymbol, setCurrencySymbol] = useState(initialSymbol);
    const [hasSalary, setHasSalary] = useState(initialHasSalary);

    const updateCurrency = (newCurrency, newSymbol) => {
        setCurrency(newCurrency);
        setCurrencySymbol(newSymbol);
    };

    return (
        <CurrencyContext.Provider value={{ currency, currencySymbol, updateCurrency, hasSalary, setHasSalary }}>
            {children}
        </CurrencyContext.Provider>
    );
};

export const useCurrency = () => useContext(CurrencyContext);
