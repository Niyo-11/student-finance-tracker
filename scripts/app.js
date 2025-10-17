// app.js - Main application controller (wires everything together)

(function() {
    'use strict';
    
    // INITIALIZATION
    
    function init() {
        State.initialize();
        renderAll();
        attachEventListeners();
        console.log('Finance Tracker initialized!');
    }
    
    function renderAll() {
        const transactions = State.getAllTransactions();
        UI.renderTransactions(transactions);
        updateDashboard();
    }
    
    
    // EVENT LISTENERS
    
    function attachEventListeners() {
        // Add Transaction button
        document.getElementById('add-transaction-btn').addEventListener('click', handleAddClick);
        
        // Cancel button
        document.getElementById('cancel-form-btn').addEventListener('click', handleCancelClick);
        
        // Form submission
        UI.elements.transactionForm.addEventListener('submit', handleFormSubmit);
        
        // Real-time validation
        UI.elements.descriptionInput.addEventListener('input', () => {
            validateField('description', UI.elements.descriptionInput.value);
        });
        
        UI.elements.amountInput.addEventListener('input', () => {
            validateField('amount', UI.elements.amountInput.value);
        });
        
        UI.elements.dateInput.addEventListener('change', () => {
            validateField('date', UI.elements.dateInput.value);
        });
        
        UI.elements.categoryInput.addEventListener('change', () => {
            validateField('category', UI.elements.categoryInput.value);
        });
        
        // Edit/Delete buttons (event delegation)
        UI.elements.transactionsContainer.addEventListener('click', handleTableClick);
    }
    
    
    // BUTTON HANDLERS
    
    function handleAddClick() {
        State.clearEditingId();
        UI.showForm('add');
    }
    
    function handleCancelClick() {
        State.clearEditingId();
        UI.hideForm();
    }
    
    function handleTableClick(e) {
        const target = e.target;
        
        // Edit button clicked
        if (target.classList.contains('edit-btn')) {
            const id = target.dataset.id;
            handleEdit(id);
        }
        
        // Delete button clicked
        if (target.classList.contains('delete-btn')) {
            const id = target.dataset.id;
            handleDelete(id);
        }
    }
    
    function handleEdit(id) {
        const transaction = State.getTransactionById(id);
        if (!transaction) return;
        
        State.setEditingId(id);
        UI.showForm('edit', transaction);
    }
    
    function handleDelete(id) {
        const transaction = State.getTransactionById(id);
        if (!transaction) return;
        
        const confirmed = confirm(`Delete "${transaction.description}"?`);
        if (!confirmed) return;
        
        State.deleteTransaction(id);
        renderAll();
    }
    
    
    // FORM HANDLING
    
    function handleFormSubmit(e) {
        e.preventDefault();
        
        const formData = UI.getFormData();
        const errors = Validators.validateTransaction(formData);
        
        // Show all errors
        UI.clearErrors();
        if (errors.description) UI.showError('description', errors.description);
        if (errors.amount) UI.showError('amount', errors.amount);
        if (errors.category) UI.showError('category', errors.category);
        if (errors.date) UI.showError('date', errors.date);
        
        // If any errors, stop
        if (Object.keys(errors).length > 0) {
            alert('Please fix all errors before saving.');
            return;
        }
        
        // Save (add or update)
        const editingId = State.getEditingId();
        if (editingId) {
            State.updateTransaction(editingId, formData);
        } else {
            State.addTransaction(formData);
        }
        
        // Refresh UI
        State.clearEditingId();
        UI.hideForm();
        renderAll();
    }
    
    function validateField(fieldName, value) {
        let error = null;
        
        switch(fieldName) {
            case 'description':
                error = Validators.validateDescription(value);
                break;
            case 'amount':
                error = Validators.validateAmount(value);
                break;
            case 'date':
                error = Validators.validateDate(value);
                break;
            case 'category':
                error = Validators.validateCategory(value);
                break;
        }
        
        if (error) {
            UI.showError(fieldName, error);
        } else {
            UI.clearError(fieldName);
        }
    }
    
    
    // DASHBOARD STATS
    
    function updateDashboard() {
        const transactions = State.getAllTransactions();
        
        const stats = {
            totalCount: transactions.length,
            totalAmount: transactions.reduce((sum, t) => sum + t.amount, 0),
            topCategory: getTopCategory(transactions),
            topCategoryAmount: getTopCategoryAmount(transactions),
            last7Days: getLast7DaysTotal(transactions)
        };
        
        UI.updateStats(stats);
    }
    
    function getTopCategory(transactions) {
        if (transactions.length === 0) return 'None';
        
        const counts = {};
        transactions.forEach(t => {
            counts[t.category] = (counts[t.category] || 0) + 1;
        });
        
        let topCategory = '';
        let maxCount = 0;
        for (const category in counts) {
            if (counts[category] > maxCount) {
                maxCount = counts[category];
                topCategory = category;
            }
        }
        
        return topCategory;
    }
    
    function getTopCategoryAmount(transactions) {
        if (transactions.length === 0) return 0;
        
        const topCategory = getTopCategory(transactions);
        return transactions
            .filter(t => t.category === topCategory)
            .reduce((sum, t) => sum + t.amount, 0);
    }
    
    function getLast7DaysTotal(transactions) {
        const today = new Date();
        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(today.getDate() - 7);
        
        return transactions
            .filter(t => new Date(t.date) >= sevenDaysAgo)
            .reduce((sum, t) => sum + t.amount, 0);
    }
    
    
    // START APPLICATION
    
    document.addEventListener('DOMContentLoaded', init);
    
})();