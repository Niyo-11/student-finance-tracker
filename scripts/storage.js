// storage.js - LocalStorage management module (IIFE pattern)

const Storage = (function() {
    'use strict';
    
    const STORAGE_KEY = 'financeTracker:transactions';
    const SETTINGS_KEY = 'financeTracker:settings';
    
           // TRANSACTION STORAGE
       
    function loadTransactions() {
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Error loading transactions:', error);
            return [];
        }
    }
    
    function saveTransactions(transactions) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
            return true;
        } catch (error) {
            console.error('Error saving transactions:', error);
            return false;
        }
    }
    
    
    // SETTINGS STORAGE
    
    function loadSettings() {
        try {
            const data = localStorage.getItem(SETTINGS_KEY);
            return data ? JSON.parse(data) : {
                budgetCap: null,
                currencyRates: { EUR: 0.85, GBP: 0.73 }
            };
        } catch (error) {
            console.error('Error loading settings:', error);
            return { budgetCap: null, currencyRates: { EUR: 0.85, GBP: 0.73 } };
        }
    }
    
    function saveSettings(settings) {
        try {
            localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
            return true;
        } catch (error) {
            console.error('Error saving settings:', error);
            return false;
        }
    }
    
    
    // IMPORT/EXPORT
    
    function exportToJSON(transactions) {
        const dataStr = JSON.stringify(transactions, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `finance-tracker-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        URL.revokeObjectURL(url);
    }
    
    function validateImportedData(data) {
        if (!Array.isArray(data)) {
            return { valid: false, error: 'Data must be an array' };
        }
        
        for (let i = 0; i < data.length; i++) {
            const item = data[i];
            if (!item.id || !item.description || item.amount === undefined || 
                !item.category || !item.date) {
                return { 
                    valid: false, 
                    error: `Invalid transaction at index ${i}: missing required fields` 
                };
            }
        }
        
        return { valid: true };
    }
    
    
    // PUBLIC API
    
    return {
        loadTransactions,
        saveTransactions,
        loadSettings,
        saveSettings,
        exportToJSON,
        validateImportedData
    };
    
})();
