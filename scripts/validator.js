// validators.js - Regex validation patterns

// 1. Description: No leading/trailing spaces, no double spaces
export const descriptionRegex = /^\S+(\s\S+)*$/;

// 2. Amount: Valid currency format (0 or positive number with max 2 decimals)
export const amountRegex = /^(0|[1-9]\d*)(\.\d{1,2})?$/;

// 3. Date: YYYY-MM-DD format
export const dateRegex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;

// 4. Category: Letters, spaces, hyphens 
export const categoryRegex = /^[A-Za-z]+(?:[ -][A-Za-z]+)*$/;

// 5. ADVANCED: Duplicate words detector (back-reference)
export const duplicateWordsRegex = /\b(\w+)\s+\1\b/i;


/**
 * Validate description field
 * @param {string} value 
 * @returns {string|null} 
 */
export function validateDescription(value) {
    if (!value || value.trim() === '') {
        return 'Description is required';
    }
    
    if (!descriptionRegex.test(value)) {
        return 'Description cannot have leading/trailing spaces or double spaces';
    }
    
    // Check for duplicate words (advanced regex)
    if (duplicateWordsRegex.test(value)) {
        return 'Description contains duplicate words (e.g., "coffee coffee")';
    }
    
    return null; 
}


/**
 * Validate amount field
 * @param {string} value 
 * @returns {string|null} 
 */
export function validateAmount(value) {
    if (!value || value.trim() === '') {
        return 'Amount is required';
    }
    
    if (!amountRegex.test(value)) {
        return 'Amount must be a valid number (e.g., 12.50 or 100)';
    }
    
    const numValue = parseFloat(value);
    if (numValue < 0) {
        return 'Amount cannot be negative';
    }
    
    if (numValue > 999999) {
        return 'Amount seems too large. Please check.';
    }
    
    return null; 
}


/**
 * Validate date field
 * @param {string} value 
 * @returns {string|null} 
 */
export function validateDate(value) {
    if (!value || value.trim() === '') {
        return 'Date is required';
    }
    
    if (!dateRegex.test(value)) {
        return 'Date must be in YYYY-MM-DD format';
    }
    
    // Checking if it's a real date 
    const dateObj = new Date(value);
    if (isNaN(dateObj.getTime())) {
        return 'Please enter a valid date';
    }
    
    // Check if date is not in the future
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (dateObj > today) {
        return 'Date cannot be in the future';
    }
    
    return null;
}


/**
 * Validate category field
 * @param {string} value 
 * @returns {string|null}
 */
export function validateCategory(value) {
    if (!value || value.trim() === '') {
        return 'Category is required';
    }
    
    // Incase we add custom categories 
    if (!categoryRegex.test(value)) {
        return 'Category can only contain letters, spaces, and hyphens';
    }
    
    return null; 
}


/**
 * Validate entire form
 * @param {Object} formData 
 * @returns {Object} 
 */
export function validateForm(formData) {
    const errors = {};
    
    const descError = validateDescription(formData.description);
    if (descError) errors.description = descError;
    
    const amountError = validateAmount(formData.amount);
    if (amountError) errors.amount = amountError;
    
    const categoryError = validateCategory(formData.category);
    if (categoryError) errors.category = categoryError;
    
    const dateError = validateDate(formData.date);
    if (dateError) errors.date = dateError;
    
    return errors;
}