# Yup Validation Schemas for Login

This document provides comprehensive documentation for using Yup validation schemas in the React Native boilerplate for login scenarios.

## Overview

The validation system provides three levels of validation schemas:

1. **Simple Schema** (`simpleLoginSchema`) - Basic validation for quick development
2. **Standard Schema** (`loginSchema`) - Comprehensive validation for production use
3. **Strict Schema** (`strictLoginSchema`) - High-security validation for sensitive applications

## Available Schemas

### 1. Simple Login Schema (`simpleLoginSchema`)

**Use Case**: Quick development, basic validation
**Requirements**:
- Email: Required, valid email format
- Password: Required, minimum 6 characters

```typescript
import { simpleLoginSchema } from './utils/ValidationSchemas';

const result = await validateLoginData(loginData, simpleLoginSchema);
```

### 2. Standard Login Schema (`loginSchema`) - **DEFAULT**

**Use Case**: Production applications, comprehensive validation
**Requirements**:

**Email Validation**:
- Required field
- Valid email format
- Maximum 254 characters
- No leading/trailing spaces
- Valid domain format
- No invalid special characters

**Password Validation**:
- Required field
- Minimum 8 characters
- Maximum 128 characters
- No leading/trailing spaces
- Must contain: uppercase, lowercase, and number
- No common passwords (password, 123456, etc.)
- No repeating characters (aaa, 111, etc.)
- No sequential characters (123, abc, etc.)

```typescript
import { loginSchema } from './utils/ValidationSchemas';

const result = await validateLoginData(loginData); // Uses default loginSchema
```

### 3. Strict Login Schema (`strictLoginSchema`)

**Use Case**: High-security applications, financial services
**Requirements**:

**Email Validation**:
- All standard requirements plus additional domain validation

**Password Validation**:
- Minimum 12 characters
- Must contain: uppercase, lowercase, number, and special character
- No personal information (name, email, common words)
- All other standard requirements

```typescript
import { strictLoginSchema } from './utils/ValidationSchemas';

const result = await validateLoginData(loginData, strictLoginSchema);
```

## Usage Examples

### Basic Usage

```typescript
import { validateLoginData } from './utils/ValidationSchemas';

const handleLogin = async (email: string, password: string) => {
  const result = await validateLoginData({ email, password });
  
  if (result.isValid) {
    // Proceed with login
    console.log('Login data is valid');
  } else {
    // Handle validation errors
    console.log('Validation errors:', result.errors);
  }
};
```

### Generic Validation (Any Schema)

```typescript
import { validateData, validateField } from './utils/ValidationSchemas';
import * as yup from 'yup';

// Create any custom schema
const userSchema = yup.object().shape({
  name: yup.string().required('Name is required'),
  age: yup.number().required('Age is required').min(18, 'Must be 18+'),
  email: yup.string().email('Invalid email').required('Email is required'),
});

// Validate complete data
const userData = { name: 'John', age: 25, email: 'john@example.com' };
const result = await validateData(userData, userSchema);

// Validate single field
const nameValidation = await validateField('name', 'John', userSchema);
```

### Real-time Field Validation

```typescript
import { validateField } from './utils/ValidationSchemas';

const handleEmailChange = async (email: string) => {
  const validation = await validateField('email', email);
  
  if (!validation.isValid) {
    setEmailError(validation.error);
  } else {
    setEmailError('');
  }
};
```

### React Integration

```typescript
import React, { useState } from 'react';
import { validateLoginData } from './utils/ValidationSchemas';

const LoginComponent = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleSubmit = async () => {
    const result = await validateLoginData({ email, password });
    
    if (result.isValid) {
      // Proceed with login
      console.log('Login successful');
    } else {
      // Set errors
      if (result.errors.email) setEmailError(result.errors.email);
      if (result.errors.password) setPasswordError(result.errors.password);
    }
  };

  return (
    // Your login form JSX
  );
};
```

## Validation Scenarios Covered

### Email Validation

✅ **Valid Emails**:
- `user@example.com`
- `user.name@domain.co.uk`
- `user+tag@example.com`

❌ **Invalid Emails**:
- `invalid-email`
- `user@`
- `@domain.com`
- ` user@example.com ` (with spaces)
- `user@example..com` (double dots)
- `user@example` (no TLD)

### Password Validation

✅ **Valid Passwords** (Standard Schema):
- `StrongPass123`
- `MySecureP@ss1`
- `ComplexPassword2024`

❌ **Invalid Passwords**:
- `password` (too common)
- `123456` (too common)
- `abc123` (too common)
- `aaa` (too short)
- `password123` (common + sequential)
- `qwerty` (sequential)
- `Password` (no numbers)
- `password123` (no uppercase)

### Validation Order

The validation follows a specific order to provide the most relevant error messages:

1. **Required Field Check**: First checks if the field is empty or contains only whitespace
2. **Format Validation**: Then validates the format (email, length, etc.)
3. **Content Validation**: Finally checks content-specific rules (strength, patterns, etc.)

**Examples:**
- Empty password → "Password is required"
- Short password → "Password must be at least 8 characters long"
- Weak password → "Password must contain at least one uppercase letter, one lowercase letter, and one number"

## Additional Schemas

### Forgot Password Schema

```typescript
import { forgotPasswordSchema } from './utils/ValidationSchemas';

const result = await forgotPasswordSchema.validate({ email });
```

### Change Password Schema

```typescript
import { changePasswordSchema } from './utils/ValidationSchemas';

const result = await changePasswordSchema.validate({
  currentPassword: 'oldPassword',
  newPassword: 'newStrongPass123',
  confirmPassword: 'newStrongPass123'
});
```

## Generic Validation Functions

The library provides two generic functions that work with any Yup schema:

### `validateData<T>(data: T, schema: yup.ObjectSchema<T>)`

Validates complete data objects against any Yup schema.

```typescript
import { validateData } from './utils/ValidationSchemas';

// Works with any schema
const result = await validateData(userData, userSchema);
const result = await validateData(loginData, loginSchema);
const result = await validateData(productData, productSchema);
```

### `validateField<T>(field: string, value: unknown, schema: yup.ObjectSchema<T>)`

Validates a single field against any Yup schema.

```typescript
import { validateField } from './utils/ValidationSchemas';

// Works with any schema
const emailValidation = await validateField('email', email, loginSchema);
const nameValidation = await validateField('name', name, userSchema);
const priceValidation = await validateField('price', price, productSchema);
```

## Error Handling

The validation functions return structured error objects:

```typescript
// Success case
{
  isValid: true,
  errors: {}
}

// Error case
{
  isValid: false,
  errors: {
    email: 'Please enter a valid email address',
    password: 'Password must be at least 8 characters long'
  }
}
```

## Custom Validation

You can create custom validation by extending the base schemas:

```typescript
import * as yup from 'yup';
import { loginSchema } from './utils/ValidationSchemas';

const customSchema = yup.object().shape({
  email: yup
    .string()
    .required('Email is required')
    .email('Please enter a valid email address')
    .test('custom-domain', 'Email must be from company domain', (value) => {
      if (!value) return true;
      return value.endsWith('@company.com');
    }),
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters long')
});
```
