// state.js - Application state management module (IIFE pattern)

const State = (function() {
    'use strict';
    
    let transactions = [];
    let settings = { budgetCap: null, currencyRates: { EUR: 0.85, GBP: 0.73 } };
    let editingId = null;
    
    // TRANSACTION MANAGEMENT
    
    function generateId() {
        return 'txn_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    function addTransaction(transactionData) {
        const transaction = {
            id: generateId(),
            description: transactionData.description.trim(),
            amount: parseFloat(transactionData.amount),
            category: transactionData.category,
            date: transactionData.date,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        transactions.push(transaction);
        Storage.saveTransactions(transactions);
        return transaction;
    }
    
    function updateTransaction(id, transactionData) {
        const index = transactions.findIndex(t => t.id === id);
        if (index === -1) return false;
        
        transactions[index] = {
            ...transactions[index],
            description: transactionData.description.trim(),
            amount: parseFloat(transactionData.amount),
            category: transactionData.category,
            date: transactionData.date,
            updatedAt: new Date().toISOString()
        };
        
        Storage.saveTransactions(transactions);
        return transactions[index];
    }
    
    function deleteTransaction(id) {
        const index = transactions.findIndex(t => t.id === id);
        if (index === -1) return false;
        
        transactions.splice(index, 1);
        Storage.saveTransactions(transactions);
        return true;
    }
    
    function getTransactionById(id) {
        return transactions.find(t => t.id === id);
    }
    
    function getAllTransactions() {
        return [...transactions]; // Return copy
    }
    
    function setTransactions(newTransactions) {
        transactions = newTransactions;
        Storage.saveTransactions(transactions);
    }
    
    
    // EDITING STATE
    
    function setEditingId(id) {
        editingId = id;
    }
    
    function getEditingId() {
        return editingId;
    }
    
    function clearEditingId() {
        editingId = null;
    }
    
    
    // SETTINGS MANAGEMENT
    
    function getSettings() {
        return { ...settings };
    }
    
    function updateSettings(newSettings) {
        settings = { ...settings, ...newSettings };
        Storage.saveSettings(settings);
    }
    
    
    // INITIALIZATION
    
    function initialize() {
        transactions = Storage.loadTransactions();
        settings = Storage.loadSettings();
        console.log(`Loaded ${transactions.length} transactions from storage`);
    }
    
    
    // PUBLIC API
    
    return {
        initialize,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        getTransactionById,
        getAllTransactions,
        setTransactions,
        setEditingId,
        getEditingId,
        clearEditingId,
        getSettings,
        updateSettings
    };
    
})();