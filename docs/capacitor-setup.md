# Capacitor — Plan de integración

## Cambios previos ya aplicados (rama `feature/capacitor-prep`)

- `firebase.ts` — `initializeAuth` con `indexedDBLocalPersistence` + `browserLocalPersistence`
- `index.html` — `viewport-fit=cover` en el meta viewport
- `index.html` — `color-scheme: light` (solo claro, evita fondo negro en WKWebView)
- `_reset.scss` — `overscroll-behavior: none` en `html` y `body` (elimina el bounce de iOS)

---

## Paso 1 — Instalar Capacitor

```bash
npm install @capacitor/core
npm install --save-dev @capacitor/cli
npx cap init
```

Durante `cap init` pedirá:
- **App name:** Applec
- **App ID:** com.applec.app (o el que se decida definitivo)
- **Web asset directory:** `build`

Esto genera `capacitor.config.ts` en la raíz.

### Añadir plataformas

```bash
npm install @capacitor/ios @capacitor/android
npx cap add ios
npx cap add android
```

> Las carpetas `android/` e `ios/` que hay ahora son de un proyecto Ionic anterior. Hay que borrarlas antes de ejecutar `npx cap add ios/android`.

---

## Paso 2 — Script de build + sync

Cada vez que haya cambios hay que hacer build y sincronizar:

```bash
npm run build
npx cap sync
```

`cap sync` copia la carpeta `build/` al proyecto nativo y actualiza los plugins.

---

## Paso 3 — Plugins del sistema

### Back button de Android (`@capacitor/app`)

Sin esto, el botón atrás de Android cierra la app o se comporta de forma inesperada.

```bash
npm install @capacitor/app
npx cap sync
```

Conectarlo con React Router en `App.tsx` (o en un hook `useAndroidBack`):

```ts
import { App } from '@capacitor/app';

App.addListener('backButton', ({ canGoBack }) => {
  if (canGoBack) {
    window.history.back();
  } else {
    App.exitApp();
  }
});
```

### Status bar (`@capacitor/status-bar`)

Controla el color y estilo de la barra de estado del móvil.

```bash
npm install @capacitor/status-bar
npx cap sync
```

Uso básico al arrancar la app:

```ts
import { StatusBar, Style } from '@capacitor/status-bar';

StatusBar.setStyle({ style: Style.Light }); // texto oscuro sobre fondo claro
StatusBar.setBackgroundColor({ color: '#FFFFFF' }); // solo Android
```

### Teclado (`@capacitor/keyboard`)

Evita que el teclado tape los inputs de la parte inferior.

```bash
npm install @capacitor/keyboard
npx cap sync
```

Configuración en `capacitor.config.ts`:

```ts
plugins: {
  Keyboard: {
    resize: 'body',
    resizeOnFullScreen: true,
  },
},
```

---

## Paso 4 — Plugins de funcionalidades nativas

### Cámara y galería (`@capacitor/camera`)

Para subir foto de perfil u otras imágenes desde la cámara o la galería del móvil.

```bash
npm install @capacitor/camera
npx cap sync
```

**Permisos requeridos:**

iOS — añadir en `ios/App/App/Info.plist`:
```xml
<key>NSCameraUsageDescription</key>
<string>Necesitamos acceso a la cámara para que puedas subir tu foto de perfil.</string>
<key>NSPhotoLibraryUsageDescription</key>
<string>Necesitamos acceso a la galería para que puedas elegir tu foto de perfil.</string>
```

Android — ya incluido automáticamente por el plugin en `AndroidManifest.xml`.

Uso básico:

```ts
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

const photo = await Camera.getPhoto({
  resultType: CameraResultType.DataUrl,
  source: CameraSource.Prompt, // pregunta si usar cámara o galería
  quality: 80,
});
```

---

### Compartir (`@capacitor/share`)

Abre el share sheet nativo del sistema (WhatsApp, guardar imagen, correo, etc.).

```bash
npm install @capacitor/share
npx cap sync
```

No requiere permisos adicionales.

Uso básico:

```ts
import { Share } from '@capacitor/share';

await Share.share({
  title: 'Applec',
  text: 'Únete a mi falla en Applec',
  url: 'https://applec.app',
});
```

---

### Push notifications (`@capacitor/push-notifications`)

Para notificaciones push (recordatorios de eventos, novedades de la falla, etc.).

```bash
npm install @capacitor/push-notifications
npx cap sync
```

Es el plugin más complejo — requiere configuración en dos sitios:

**Firebase Cloud Messaging (FCM):**
1. Ir a Firebase Console → Project Settings → Cloud Messaging
2. Descargar `google-services.json` (Android) y `GoogleService-Info.plist` (iOS)
3. Colocarlos en las carpetas nativas correspondientes

**APNs (Apple Push Notification service) — solo iOS:**
1. Necesita una cuenta de Apple Developer de pago
2. Crear un certificado APNs o Auth Key en developer.apple.com
3. Subir la key a Firebase Console

Uso básico:

```ts
import { PushNotifications } from '@capacitor/push-notifications';

await PushNotifications.requestPermissions();
await PushNotifications.register();

PushNotifications.addListener('registration', (token) => {
  // guardar el token en Firestore asociado al usuario
});
```

---

### Portapapeles (`@capacitor/clipboard`)

Para copiar códigos de invitación, links, etc.

```bash
npm install @capacitor/clipboard
npx cap sync
```

No requiere permisos adicionales.

```ts
import { Clipboard } from '@capacitor/clipboard';

await Clipboard.write({ string: codigoInvitacion });
```

---

### Vibración / haptics (`@capacitor/haptics`)

Feedback táctil al hacer acciones (confirmar asistencia, guardar, etc.). Mejora mucho la sensación nativa.

```bash
npm install @capacitor/haptics
npx cap sync
```

No requiere permisos adicionales.

```ts
import { Haptics, ImpactStyle } from '@capacitor/haptics';

await Haptics.impact({ style: ImpactStyle.Medium }); // vibración media
await Haptics.notification({ type: NotificationType.Success }); // patrón de éxito
```

---

## Paso 5 — Abrir en Xcode / Android Studio

```bash
npx cap open ios      # abre Xcode
npx cap open android  # abre Android Studio
```

Desde ahí se hace el build nativo y se instala en el dispositivo o simulador.

---

## Notas

- Si en el futuro se añade Google Sign-in u otro OAuth, hay que usar `@capacitor-firebase/authentication` en vez del SDK web nativo de Firebase Auth.
- Las fuentes (Google Fonts, Fontshare) se cargan de CDN. Para soportar offline hay que auto-hostarlas en `public/`.
