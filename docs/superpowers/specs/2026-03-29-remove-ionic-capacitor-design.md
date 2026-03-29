# Remove Ionic & Capacitor — Migration to Pure React + SCSS

**Date:** 2026-03-29
**Approach:** In-place migration (component by component)
**Target:** Web-only SPA with HTML + SCSS (no UI library)
**Router:** Keep React Router v5

---

## Scope

Remove all Ionic and Capacitor dependencies, replacing Ionic components with plain HTML elements styled with SCSS. No changes to business logic, Firebase, i18next, or react-hook-form.

## Component Replacements

| Ionic Component | Replacement |
|---|---|
| `IonApp` | `<div className="app">` |
| `IonPage` | `<div className="page">` |
| `IonContent` | `<main className="page-content">` |
| `IonHeader` + `IonToolbar` | `<header className="toolbar">` |
| `IonAlert` | `<dialog>` element with custom SCSS |
| `IonSpinner` | CSS-only spinner (`@keyframes` animation) |
| `IonReactRouter` | `BrowserRouter` from `react-router-dom` |
| `IonRouterOutlet` | `Switch` from `react-router-dom` |
| `useIonRouter` | `useHistory` from `react-router-dom` |
| `setupIonicReact()` | Removed entirely |
| `ionicons` | Removed (use inline SVG or Unicode where needed) |

## Files to Modify

### Core Files
- **App.tsx** — Remove `IonApp`, `setupIonicReact()`, all `@ionic/react/css/*` imports. Wrap app in `<div className="app">`.
- **AppRoutes.tsx** — Replace `IonReactRouter` with `BrowserRouter`, `IonRouterOutlet` with `Switch`.
- **index.tsx** — No Ionic changes needed (already uses standard React DOM).

### Pages (replace `IonPage`/`IonContent` with `<div className="page">`/`<main className="page-content">`)
- `src/pages/home/Home.tsx` — Also replace `IonHeader`/`IonToolbar`/`IonAlert`
- `src/pages/onboarding/welcome/WelcomePage.tsx`
- `src/pages/onboarding/language/LanguagePage.tsx`
- `src/pages/onboarding/group/GroupPage.tsx`
- `src/pages/groups/createGroup/CreateGroupPage.tsx`
- `src/pages/auth/login/LoginPage.tsx`
- `src/pages/auth/register/RegisterPage.tsx`
- `src/pages/auth/forgotPassword/ForgotPasswordPage.tsx`

### Components (replace `useIonRouter` with `useHistory`)
- `src/components/onboarding/welcome/Welcome.tsx`
- `src/components/onboarding/language/Language.tsx`
- `src/components/auth/login/Login.tsx`
- `src/components/auth/register/Register.tsx`
- `src/components/auth/forgotPassword/ForgotPassword.tsx`

### Components (replace Ionic UI)
- `src/components/feedback/alerts/Alert.tsx` — `IonAlert` to `<dialog>` + SCSS
- `src/components/feedback/loading/Loading.tsx` — `IonSpinner` to CSS spinner

## Files to Delete

- `capacitor.config.ts`
- `ionic.config.json`
- `/android/` directory (entire)
- `/ios/` directory (entire)
- `/src/styles/ionic-theme/` directory (entire)

## Styles

- Remove all `@ionic/react/css/*` imports from App.tsx (10 CSS files)
- Delete `/src/styles/ionic-theme/_ionic-variables.css`
- Migrate any needed color variables to `/src/styles/setup/_custom-properties.scss`
- Verify/update reset CSS in `/src/styles/setup/_reset.scss` to not depend on Ionic normalize
- Add base styles for `.app`, `.page`, `.page-content`, `.toolbar` classes

## Dependencies to Remove (package.json)

**Dependencies:**
- `@ionic/react`
- `@ionic/react-router`
- `@capacitor/core`
- `@capacitor/android`
- `@capacitor/ios`
- `ionicons`

**Dev dependencies:**
- `@capacitor/cli`

## Scripts to Clean (package.json)

- Remove `sync-android` script
- Remove `open-android` script
- Remove any other Capacitor-related scripts

## public/index.html

- Remove `viewport-fit=cover` from viewport meta tag (not needed for web-only)
- Keep standard mobile viewport settings

## What Is NOT Changing

- Firebase authentication and Firestore integration
- i18next internationalization setup
- react-hook-form usage
- React Router v5 route structure and protection logic (PrivateRoutes/PublicRoutes)
- SCSS architecture (setup/, base/, utilities/)
- Component business logic
