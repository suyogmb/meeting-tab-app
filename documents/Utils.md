# Utils Documentation

This document summarizes the shared utility modules used across the React Native TypeScript boilerplate.

## 📋 Overview

Utilities are:
- **Reusable** helpers for sizing, typography, images, storage, validation, and constants
- **Performant** with precomputed scales and lightweight functions
- **Consistent** across screens, components, and network layers

## 📁 Utility Files

| Module | File | Description |
|--------|------|-------------|
| **Typography** | `src/utils/Typography.ts` | Semantic text styles via `TypographyStyleEnum` and `getTypographyStyle` |
| **FontUtils** | `src/utils/FontUtils.ts` | Font families and base font sizes |
| **Dimensions** | `src/utils/Dimensions.ts` | Screen helpers: `normalize`, `verticalScale`, `moderateScale`, dp helpers |
| **SizeUtility** | `src/utils/SizeUtility.ts` | Precomputed responsive constants: `N_*`, `V_*`, `M_*` |
| **ValidationSchemas** | `src/utils/ValidationSchemas.ts` | Yup schemas and helpers `validateData`, `validateField` |
| **ValidationUtils** | `src/utils/ValidationUtils.ts` | Additional validation helpers (if any) |
| **StorageService** | `src/utils/StorageService.ts` | Persistent storage helpers and keys |
| **SecureLogger** | `src/utils/SecureLogger.ts` | Secure logging utilities |
| **Constants** | `src/utils/Constants.ts` | App constants like `ERROR_CODES`, `TOAST_TYPE` |
| **ImageConstants** | `src/utils/ImageConstants.ts` | Bundled asset references (logo, icons) |
| **NewRelic** | `src/utils/NewRelic.ts` | New Relic agent initialization |

## 🎯 Details & Usage Examples

### Typography

```tsx
import {Text} from 'react-native';
import {getTypographyStyle, TypographyStyleEnum} from 'utils/Typography';

<Text style={getTypographyStyle(TypographyStyleEnum.TITLE)}>Title</Text>
<Text style={getTypographyStyle(TypographyStyleEnum.BODY)}>Body</Text>
```

### FontUtils

```ts
import {fontFamily, fontSizes} from 'utils/FontUtils';

const styles = {
  title: { fontFamily: fontFamily.semiBold, fontSize: fontSizes.F20 },
};
```

### Dimensions

```ts
import {normalize, verticalScale, moderateScale} from 'utils/Dimensions';

const padding = normalize(16);
const height = verticalScale(48);
const radius = moderateScale(8);
```

### SizeUtility (precomputed constants)

```ts
import {N_16, V_20, M_14} from 'utils/SizeUtility';

const styles = {
  container: { padding: N_16, marginVertical: V_20 },
  text: { fontSize: M_14 },
};
```

### ValidationSchemas

```ts
import {loginSchema, validateData, validateField} from 'utils/ValidationSchemas';

// Validate full form
const result = await validateData({ email, password }, loginSchema);
if (!result.isValid) { /* handle errors */ }

// Validate single field
const emailCheck = await validateField('email', email, loginSchema);
```

### Constants

```ts
import {ERROR_CODES, TOAST_TYPE} from 'utils/Constants';

if (status === ERROR_CODES.UNAUTHORIZED) { /* refresh token */ }
Toast.show({ type: TOAST_TYPE.ERROR, text1: 'Error' });
```

### ImageConstants

```tsx
import ImageConstants from 'utils/ImageConstants';

<Image source={ImageConstants.LogoPng} />
```

### NewRelic

```ts
// Side-effectful module; import once at app startup
import 'utils/NewRelic';
```

### StorageService and SecureLogger

- StorageService: persistent key-value storage (e.g., tokens, flags)
- SecureLogger: centralized logging with safeguards for sensitive data

```ts
import StorageService from 'utils/StorageService';

await StorageService.storeItem(StorageService.storageKeys.isLoggedIn, true);
const token = await StorageService.getItem(StorageService.storageKeys.token);
```

