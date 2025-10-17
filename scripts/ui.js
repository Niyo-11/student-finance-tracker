// ui.js - UI rendering and DOM manipulation module (IIFE pattern)

const UI = (function() {
    'use strict';
    
    // DOM ELEMENTS
    
    const elements = {
        formSection: document.getElementById('form-section'),
        transactionForm: document.getElementById('transaction-form'),
        formTitle: document.getElementById('form-title'),
        transactionsContainer: document.getElementById('transactions-container'),
        
        // Form inputs
        descriptionInput: document.getElementById('description'),
        amountInput: document.getElementById('amount'),
        categoryInput: document.getElementById('category'),
        dateInput: document.getElementById('date'),
        transactionIdInput: document.getElementById('transaction-id'),
        
        // Error spans
        descriptionError: document.getElementById('description-error'),
        amountError: document.getElementById('amount-error'),
        categoryError: document.getElementById('category-error'),
        dateError: document.getElementById('date-error')
    };
    
    
    // FORM MANAGEMENT
    
    function showForm(mode = 'add', transaction = null) {
        elements.formSection.style.display = 'block';
        clearErrors();
        
        if (mode === 'add') {
            elements.formTitle.textContent = 'Add Transaction';
            elements.transactionForm.reset();
            elements.transactionIdInput.value = '';
        } else if (mode === 'edit' && transaction) {
            elements.formTitle.textContent = 'Edit Transaction';
            elements.descriptionInput.value = transaction.description;
            elements.amountInput.value = transaction.amount;
            elements.categoryInput.value = transaction.category;
            elements.dateInput.value = transaction.date;
            elements.transactionIdInput.value = transaction.id;
        }
        
        elements.formSection.scrollIntoView({ behavior: 'smooth' });
    }
    
    function hideForm() {
        elements.formSection.style.display = 'none';
        elements.transactionForm.reset();
        clearErrors();
    }
    
    function showError(field, message) {
        const errorElement = elements[field + 'Error'];
        const inputElement = elements[field + 'Input'];
        
        if (errorElement) {
            errorElement.textContent = message;
        }
        if (inputElement) {
            inputElement.setAttribute('aria-invalid', 'true');
        }
    }
    
    function clearError(field) {
        const errorElement = elements[field + 'Error'];
        const inputElement = elements[field + 'Input'];
        
        if (errorElement) {
            errorElement.textContent = '';
        }
        if (inputElement) {
            inputElement.removeAttribute('aria-invalid');
        }
    }
    
    function clearErrors() {
        clearError('description');
        clearError('amount');
        clearError('category');
        clearError('date');
    }
    
    function getFormData() {
        return {
            id: elements.transactionIdInput.value,
            description: elements.descriptionInput.value,
            amount: elements.amountInput.value,
            category: elements.categoryInput.value,
            date: elements.dateInput.value
        };
    }
    
    
    // TRANSACTION RENDERING
    
    function renderTransactions(transactions) {
        if (transactions.length === 0) {
            elements.transactionsContainer.innerHTML = 
                '<p class="empty-state">No transactions yet. Click "Add Transaction" above to get started!</p>';
            return;
        }
        
        // Create table
        const table = document.createElement('table');
        table.className = 'transactions-table';
        table.innerHTML = `
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Description</th>
                    <th>Category</th>
                    <th>Amount</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody id="transactions-tbody">
            </tbody>
        `;
        
        const tbody = table.querySelector('#transactions-tbody');
        
        transactions.forEach(transaction => {
            const row = createTransactionRow(transaction);
            tbody.appendChild(row);
        });
        
        elements.transactionsContainer.innerHTML = '';
        elements.transactionsContainer.appendChild(table);
    }
    
    function createTransactionRow(transaction) {
        const row = document.createElement('tr');
        row.dataset.id = transaction.id;
        
        row.innerHTML = `
            <td>${transaction.date}</td>
            <td>${escapeHtml(transaction.description)}</td>
            <td>${transaction.category}</td>
            <td>$${transaction.amount.toFixed(2)}</td>
            <td class="actions">
                <button class="edit-btn" data-id="${transaction.id}">✏️ Edit</button>
                <button class="delete-btn" data-id="${transaction.id}">🗑️ Delete</button>
            </td>
        `;
        
        return row;
    }
    
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    

    // STATS RENDERING
    
    function updateStats(stats) {
    const totalCount = document.getElementById('total-count');
    const totalAmount = document.getElementById('total-amount');
    const topCategory = document.getElementById('top-category');
    const topCategoryAmount = document.getElementById('top-category-amount');
    const last7Days = document.getElementById('last-7-days');
    
    if (totalCount) totalCount.textContent = stats.totalCount;
    if (totalAmount) totalAmount.textContent = '$' + stats.totalAmount.toFixed(2);
    if (topCategory) topCategory.textContent = stats.topCategory || 'None';
    if (topCategoryAmount) {
        topCategoryAmount.textContent = stats.topCategoryAmount ? 
            '$' + stats.topCategoryAmount.toFixed(2) : '';
    }
    if (last7Days) last7Days.textContent = '$' + stats.last7Days.toFixed(2);
    
    // Update budget status
    updateBudgetStatus(stats.totalAmount);
}
    
    function updateBudgetStatus(totalAmount) {
        const budgetCard = document.getElementById('budget-card');
        const budgetStatus = document.getElementById('budget-status');
        const settings = State.getSettings();
        
        if (!settings.budgetCap) {
            budgetStatus.textContent = 'Not Set';
            budgetStatus.className = 'stat-value';
            return;
        }
        
        const remaining = settings.budgetCap - totalAmount;
        
        if (remaining >= 0) {
            budgetStatus.textContent = `$${remaining.toFixed(2)} remaining`;
            budgetStatus.className = 'stat-value budget-ok';
        } else {
            budgetStatus.textContent = `$${Math.abs(remaining).toFixed(2)} over!`;
            budgetStatus.className = 'stat-value budget-over';
        }
    }
    
    
    // PUBLIC API

    return {
        elements,
        showForm,
        hideForm,
        showError,
        clearError,
        clearErrors,
        getFormData,
        renderTransactions,
        updateStats,
        updateBudgetStatus
    };
    
})();