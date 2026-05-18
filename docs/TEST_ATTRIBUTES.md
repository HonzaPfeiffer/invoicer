# Test Attributes Guide

This document lists all `data-testid` attributes that should be added to frontend components for E2E testing.

## Authentication Components

### Login Form
```tsx
<input data-testid="login-email" name="email" type="email" />
<input data-testid="login-password" name="password" type="password" />
<button data-testid="login-submit" type="submit">Sign In</button>
<div data-testid="login-error">Error message</div>
```

### Register Form
```tsx
<a data-testid="register-link" href="/register">Register</a>
<input data-testid="register-name" name="name" type="text" />
<input data-testid="register-email" name="email" type="email" />
<input data-testid="register-password" name="password" type="password" />
<button data-testid="register-submit" type="submit">Register</button>
```

## Dashboard Components

### Navigation
```tsx
<button data-testid="new-invoice-button">New Invoice</button>
<a data-testid="settings-link" href="/settings">Settings</a>
```

### Invoice List
```tsx
<div data-testid="invoice-{invoiceNumber}">
  <!-- Invoice item -->
</div>
```

## Invoice Components

### Invoice Form
```tsx
<input data-testid="invoice-number" name="invoiceNumber" />
<input data-testid="client-name" name="clientName" />
<input data-testid="client-address" name="clientAddress" />
<input data-testid="client-email" name="clientEmail" />
<input data-testid="invoice-amount" name="totalAmount" />
<select data-testid="invoice-currency" name="currency">
  <option value="CZK">CZK</option>
  <option value="EUR">EUR</option>
  <option value="USD">USD</option>
</select>
<button data-testid="invoice-save">Save</button>
```

### Invoice Detail
```tsx
<div data-testid="invoice-detail">
  <!-- Invoice detail content -->
</div>
<button data-testid="invoice-edit">Edit</button>
<button data-testid="invoice-delete">Delete</button>
<button data-testid="invoice-download-pdf">Download PDF</button>
<button data-testid="confirm-delete">Confirm</button>
```

## Settings Components

### Company Settings Form
```tsx
<form data-testid="settings-form">
  <input data-testid="company-name" name="companyName" />
  <input data-testid="company-address" name="companyAddress" />
  <input data-testid="company-tax-id" name="companyIco" />
  <button data-testid="settings-save">Save Changes</button>
</form>
```

## Common Components

### Messages/Notifications
```tsx
<div data-testid="message">Success/Error message</div>
```

## Implementation Example

```tsx
// Before
<input name="email" type="email" />

// After
<input 
  data-testid="login-email"
  name="email" 
  type="email" 
/>
```

## Best Practices

1. **Use descriptive IDs**: `data-testid="invoice-save"` not `data-testid="btn1"`
2. **Be consistent**: Use kebab-case for all test IDs
3. **Dynamic IDs**: For lists, use `data-testid="invoice-${id}"` pattern
4. **Don't overuse**: Only add to elements that tests interact with
5. **Keep stable**: Don't change test IDs without updating tests

## Files to Update

Based on the page object models, update these components:

1. **Login/Auth Components**
   - `src/app/components/LoginForm.tsx` (or similar)
   - `src/app/components/RegisterForm.tsx`

2. **Dashboard Components**
   - `src/app/dashboard/page.tsx`
   - `src/app/components/InvoicesList.tsx`

3. **Invoice Components**
   - `src/app/components/InvoiceForm.tsx`
   - `src/app/components/InvoiceDetail.tsx`

4. **Settings Components**
   - `src/app/settings/page.tsx`
   - `src/app/components/SettingsForm.tsx`

## Verification

After adding test IDs, verify with:

```bash
# Run tests to ensure selectors work
npm run test:e2e
```
