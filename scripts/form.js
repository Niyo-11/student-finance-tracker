// form.js - Handle form display, validation, and submission

import {
  validateDescription,
  validateAmount,
  validateDate,
  validateCategory,
} from "./validators.js";

// form elements
const formSection = document.getElementById("form-section");
const form = document.getElementById("transaction-form");
const formTitle = document.getElementById("form-title");
const addBtn = document.getElementById("add-transaction-btn");
const cancelBtn = document.getElementById("cancel-form-btn");

// form fields
const descriptionInput = document.getElementById("description");
const amountInput = document.getElementById("amount");
const categoryInput = document.getElementById("category");
const dateInput = document.getElementById("date");
const transactionIdInput = document.getElementById("transaction-id");

// error messages
const descriptionError = document.getElementById("description-error");
const amountError = document.getElementById("amount-error");
const categoryError = document.getElementById("category-error");
const dateError = document.getElementById("date-error");

let isEditMode = false;

export function showForm(transaction = null) {
  formSection.style.display = "block";
  formSection.scrollIntoView({ behavior: "smooth" });

  if (transaction) {
    isEditMode = true;
    formTitle.textContent = "Edit Transaction";

    descriptionInput.value = transaction.description;
    amountInput.value = transaction.amount;
    categoryInput.value = transaction.category;
    dateInput.value = transaction.date;
    transactionIdInput.value = transaction.id;
  } else {
    isEditMode = false;
    formTitle.textContent = "Add Transaction";
    form.reset();
    transactionIdInput.value = "";

    // Set default date to today
    const today = new Date().toISOString().split("T")[0];
    dateInput.value = today;
  }

  clearErrors();

  descriptionInput.focus();
}


export function hideForm() {
  formSection.style.display = "none";
  form.reset();
  clearErrors();
}


function clearErrors() {
  descriptionError.textContent = "";
  amountError.textContent = "";
  categoryError.textContent = "";
  dateError.textContent = "";
}


function showError(errorElement, message) {
  errorElement.textContent = message;
  errorElement.parentElement
    .querySelector("input, select")
    .setAttribute("aria-invalid", "true");
}


function clearError(errorElement) {
  errorElement.textContent = "";
  errorElement.parentElement
    .querySelector("input, select")
    .removeAttribute("aria-invalid");
}

/**
 * Validate a single field and show/hide error
 */
function validateField(input, validateFunc, errorElement) {
  const error = validateFunc(input.value);

  if (error) {
    showError(errorElement, error);
    return false;
  } else {
    clearError(errorElement);
    return true;
  }
}

/**
 * Initialize form event listeners
 */
export function initForm() {
  addBtn.addEventListener("click", () => {
    showForm();
  });

  cancelBtn.addEventListener("click", () => {
    hideForm();
  });

  descriptionInput.addEventListener("blur", () => {
    validateField(descriptionInput, validateDescription, descriptionError);
  });

  amountInput.addEventListener("blur", () => {
    validateField(amountInput, validateAmount, amountError);
  });

  categoryInput.addEventListener("change", () => {
    validateField(categoryInput, validateCategory, categoryError);
  });

  dateInput.addEventListener("blur", () => {
    validateField(dateInput, validateDate, dateError);
  });

  form.addEventListener("submit", handleSubmit);
}

/**
 * Handle form submission
 */
function handleSubmit(e) {
  e.preventDefault();

  // Validate all fields
  const isDescValid = validateField(
    descriptionInput,
    validateDescription,
    descriptionError
  );
  const isAmountValid = validateField(amountInput, validateAmount, amountError);
  const isCategoryValid = validateField(
    categoryInput,
    validateCategory,
    categoryError
  );
  const isDateValid = validateField(dateInput, validateDate, dateError);

  // If any field is invalid, stop
  if (!isDescValid || !isAmountValid || !isCategoryValid || !isDateValid) {
    if (!isDescValid) descriptionInput.focus();
    else if (!isAmountValid) amountInput.focus();
    else if (!isCategoryValid) categoryInput.focus();
    else if (!isDateValid) dateInput.focus();
    return;
  }

  // All valid! Create transaction object
  const transaction = {
    id: transactionIdInput.value || generateId(),
    description: descriptionInput.value.trim(),
    amount: parseFloat(amountInput.value),
    category: categoryInput.value,
    date: dateInput.value,
    createdAt: transactionIdInput.value ? undefined : new Date().toISOString(), 
    updatedAt: new Date().toISOString(),
  };

  console.log("Transaction to save:", transaction);

  hideForm();

  alert(isEditMode ? "Transaction updated!" : "Transaction added!");
}

// unique transaction ID
 
function generateId() {
  return "txn_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);
}
