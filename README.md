# student-finance-tracker
A responsive, accessible vanilla HTML/CSS/JS app to track student finances — budgets, transactions, search, and simple analytics.

2. Data Model 
Transaction Object:
- id: unique identifier (string, e.g., "txn_001")
- description: what was purchased (string)
- amount: cost in dollars (number, e.g., 12.50)
- category: Food | Books | Transport | Entertainment | Fees | Other
- date: when it happened (string, format: "YYYY-MM-DD")
- createdAt: timestamp when record was created
- updatedAt: timestamp when last edited
Example: Buying lunch
{
  "id": "txn_001",
  "description": "Lunch at cafeteria", 
  "amount": 12.50,
  "category": "Food",
  "date": "2025-10-14",
  "createdAt": "2025-10-14T12:30:00Z",
  "updatedAt": "2025-10-14T12:30:00Z"
}
id is unique.
date is YYYY-MM-DD.
createdAt / updatedAt are ISO timestamps.

3. Accessibility Plan
Keyboard Navigation Flow:

Tab key moves between: nav links → add button → form fields → table rows → action buttons
Enter key: submits forms, activates buttons
Escape key: cancels edit mode or closes dialogs

ARIA Features I'll Use:

role="alert" for form error messages (announces immediately)
aria-live="polite" for stats updates (announces when user is idle)
aria-live="assertive" for budget warnings (announces immediately)
All form inputs have <label> tags with proper for attributes
Table has <th> headers for screen readers

Color & Contrast:

Will test with browser DevTools to ensure text is readable
Focus states will have visible outlines (not removed!)
Error messages in red with icon (not just color)