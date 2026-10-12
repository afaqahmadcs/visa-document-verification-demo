# Document Authenticity Validator

A web application for document authenticity validation, built to replicate official document verification portals with responsive layouts, real-time input formatting, and clean client-side routing.

---

## 🚀 How to Run Locally

### Option 1: Open Directly in Browser
Open [`index.html`](file:///d:/US%20Client/visa-verification-demo/index.html) directly with any modern web browser.

### Option 2: Local HTTP Server (Python)
Run the following command in the project directory:
```bash
python -m http.server 8080
```
Then visit in your browser: `http://localhost:8080`

### Option 3: Automated Test Suite (Node.js)
```bash
node test_suite.js
```

---

## 📌 Features & Architecture

1. **Search & Validation Screen:**
   - Responsive multi-line heading on mobile and single-line layout on desktop.
   - Clean, centered input box with floating label (`Verification Code`).
   - Dynamic real-time UUID formatting mask (8-4-4-4-12 pattern).
   - Validation handling: prompts user if submitted with an empty code.
   - Action buttons: `Validate` and `To clean`.

2. **Loading State:**
   - Realistic loading overlay (`Wait...`) simulating authentication query processing.

3. **Document Result Screen:**
   - Official badge header and clean headings (`Authentic document` / `Document data`).
   - Uniform data layout displaying status, document code, name, and identity details.
   - Single-click return button (`To go back`).

4. **Single Page Routing & Direct URL Support:**
   - Supports direct slug and query parameter URL lookups on Vercel deployment.
   - Configured with SPA rewrite rules in `vercel.json`.
