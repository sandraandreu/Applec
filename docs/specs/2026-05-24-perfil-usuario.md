# Spec — Perfil de usuario

**Fecha:** 2026-05-24
**Estado:** ✅ implementado y mergeado a `develop`
**Rama:** `feature/profile` → mergeada el 2026-05-27

---

## Contexto

Pantalla de perfil accesible desde la barra de navegación inferior. Agrupa la gestión de la cuenta del usuario y la configuración del grupo. Actualmente no existe ninguna pantalla en `/profile`.

---

## 1. Componentes y estructura

### Componentes nuevos (no en spec original)

| Archivo | Descripción |
|---|---|
| `src/components/page-header/PageHeader.tsx` | ✅ Barra de subpágina: flecha atrás + título |
| `src/components/settings-row/SettingsRow.tsx` | ✅ Fila de ajustes: icono + label + chevron, variante danger |

### Archivos nuevos de páginas

```
src/pages/profile/
  profile/ProfilePage.tsx                              ✅ hecho
  profile/profile.scss                                 ✅ hecho
  edit-profile/EditProfilePage.tsx                     ✅ hecho (useState, no useReducer)
  edit-profile/edit-profile.scss                       ✅ hecho
  change-password/ChangePasswordPage.tsx               ✅ hecho (useReducer)
  change-password/change-password.reducer.ts           ✅ hecho
  change-password/change-password.scss                 ✅ hecho
  group-settings/GroupSettingsPage.tsx                 ✅ hecho (useState, no useReducer)
  group-settings/group-settings.scss                   ✅ hecho
  notifications-settings/NotificationsSettingsPage.tsx ✅ hecho
  notifications-settings/notifications-settings.scss   ✅ hecho
```

> **Nota:** `EditProfilePage` y `GroupSettingsPage` usan `useState` en lugar de `useReducer` — los estados de carga/error no justificaban un reducer completo.

### Archivos modificados

| Archivo | Cambio | Estado |
|---|---|---|
| `src/routes/AppRoutes/AppRoutes.tsx` | Añadir rutas `/profile`, `/profile/edit`, `/profile/change-password`, `/profile/group-settings`, `/profile/notifications-settings` | ✅ hecho |
| `src/components/layout/layout.scss` | Añadir variantes `--bg-*-top` para gradiente en la parte superior de la pantalla | ✅ hecho |
| `src/pages/groups/invite-group/InviteGroupPage.tsx` | Añadir botón "Regenerar código" (solo admin, solo desde perfil) + modal de confirmación | ✅ hecho |
| `src/services/auth.service.ts` | Añadir `changePassword()` | ✅ hecho |
| `src/services/group.service.ts` | Añadir `regenerateInviteCode()`, `deleteGroup()`, `updateMemberFields()` (reemplaza `updateMemberPhotoUrl`, cubre nombre y foto) | ✅ hecho |
| `src/services/user.service.ts` | Añadir `updateUserFields()`, `clearGroupDeletedFlag()` | ✅ hecho |
| `src/models/user.model.ts` | Añadir `groupDeleted?` a `UserProfile`; añadir `canManageGroup` y `canShareAccess` a `UserPermissions` | ✅ hecho |
| `src/pages/onboarding/welcome/WelcomePage.tsx` | Modal de notificación cuando `profile.groupDeleted === true`; limpia el flag tras cerrar | ✅ hecho |

### Rutas nuevas en AppRoutes

Todas dentro de `PrivateRoutes` con `requiresGroup`:

| Ruta | Componente | Layout |
|---|---|---|
| `/profile` | `ProfilePage` | `MainLayout` (con TabBar) |
| `/profile/edit` | `EditProfilePage` | sin MainLayout |
| `/profile/change-password` | `ChangePasswordPage` | sin MainLayout |
| `/profile/group-settings` | `GroupSettingsPage` | sin MainLayout |
| `/profile/notifications-settings` | `NotificationsSettingsPage` | sin MainLayout |

---

## 2. Modelo de datos

No se añaden colecciones nuevas en Firestore. Los cambios son sobre documentos existentes:

| Documento | Campo | Operación |
|---|---|---|
| `users/{uid}` | `firstName`, `lastName`, `photoUrl` | update (editar perfil) |
| `groups/{groupId}` | `name`, `imageUrl` | update (configuración del grupo) |
| `groups/{groupId}` | `inviteCode` | update (regenerar código) |
| `groups/{groupId}` | — | delete (eliminar grupo) |

El campo `email` del `UserProfile` se muestra pero nunca se edita desde la app (requeriría reautenticación en Firebase Auth y está fuera del MVP).

---

## 3. Lógica y servicios

### `auth.service.ts` — método nuevo

```ts
// Método de escritura — sin try/catch, el error sube al componente
export const changePassword = async (
  currentPassword: string,
  newPassword: string,
): Promise<void> => {
  const user = auth.currentUser;
  if (!user || !user.email) throw new Error("No authenticated user");
  const credential = EmailAuthProvider.credential(user.email, currentPassword);
  await reauthenticateWithCredential(user, credential);
  await updatePassword(user, newPassword);
};
```

Errores relevantes de Firebase a mapear en el componente:
- `auth/wrong-password` → contraseña actual incorrecta
- `auth/weak-password` → contraseña nueva demasiado débil
- `auth/requires-recent-login` → sesión caducada, pedir que vuelva a iniciar sesión

### `user.service.ts` — método nuevo

```ts
// Método de escritura — sin try/catch
export const updateUserProfile = async (
  uid: string,
  data: Partial<Pick<UserProfile, "firstName" | "lastName" | "photoUrl">>,
): Promise<void> => {
  await updateDoc(doc(db, "users", uid), data);
};
```

### `group.service.ts` — métodos nuevos

```ts
// Escritura — sin try/catch
export const updateGroupSettings = async (
  groupId: string,
  data: Partial<Pick<Group, "name" | "imageUrl">>,
): Promise<void> => {
  await updateDoc(doc(db, "groups", groupId), data);
};

// Escritura — sin try/catch
export const regenerateInviteCode = async (groupId: string): Promise<void> => {
  const newCode = generateInviteCode(); // 6 caracteres alfanuméricos
  await updateDoc(doc(db, "groups", groupId), { inviteCode: newCode });
};

// Escritura — sin try/catch. Operación atómica con writeBatch:
// borra el documento del grupo Y elimina groupId de todos los miembros.
// Si cualquier operación falla, no se ejecuta ninguna.
export const deleteGroup = async (
  groupId: string,
  memberUids: string[],
): Promise<void> => {
  const batch = writeBatch(db);
  batch.delete(doc(db, "groups", groupId));
  for (const uid of memberUids) {
    batch.update(doc(db, "users", uid), { groupId: deleteField() });
  }
  await batch.commit();
};
// El componente obtiene memberUids desde GroupContext (group.members.map(m => m.uid))
```

---

## 4. UI por pantalla

### `/profile` — ProfilePage ✅ hecho

Estructura implementada: header con Avatar, nombre, email y Chip de rol. Secciones con `SettingsRow`, lógica de roles, modal de logout. Gradiente de fondo por rol aplicado en `MainLayout` según la ruta.

Header con gradiente por rol (mismo patrón que `MemberDetailPage`):
- `--admin` → `var(--color-bg-gradient-red)`
- `--organizer` → `var(--color-bg-gradient-teal)`
- `--member` → `var(--color-bg-gradient-blue)`

Contenido del header: avatar circular con iniciales · nombre completo · email · badge de rol (`<Chip role={profile.role} />`).

**Sección "Mi cuenta"** (todos los roles):

| Fila | Destino |
|---|---|
| Editar perfil | `/profile/edit` |
| Cambiar contraseña | `/profile/change-password` |
| Mis vinculados | `/members/linked` (página existente) |
| Notificaciones | `/profile/notifications-settings` |
| Idioma | `/onboarding/language` (página existente) |

**Sección "Mi falla"**:

| Fila | Roles | Destino |
|---|---|---|
| Compartir acceso | admin + organizer | `/invite-group` |
| Configuración del grupo | solo admin | `/profile/group-settings` |
| Cerrar sesión | todos | llama a `logout()` del AuthContext |

Cerrar sesión: texto y chevron en rojo. Antes de ejecutar `logout()` se muestra un `Modal` de confirmación.

### `/profile/edit` — EditProfilePage

- TopBar con flecha atrás + título "Editar perfil"
- Avatar con overlay de icono de cámara + texto "Cambiar foto" (selección de imagen, sube a Firebase Storage y actualiza `photoUrl`)
- Campo Nombre (`firstName`) — requerido
- Campo Apellidos (`lastName`) — requerido
- Campo Correo electrónico — visible, `disabled`, no editable
- Botón "Guardar cambios"
- Estados: idle · loading · success (banner) · error (mensaje inline)
- `useReducer` con acciones `SUBMIT_START`, `SUBMIT_SUCCESS`, `SUBMIT_ERROR`
- Llama a `updateUserProfile()` al guardar y después a `refreshProfile()` del AuthContext

### `/profile/change-password` — ChangePasswordPage

- TopBar con flecha atrás + título "Cambiar contraseña"
- Input contraseña actual (con eye toggle)
- Input nueva contraseña (con eye toggle)
- Input confirmar nueva contraseña (con eye toggle)
- Validación cliente: nueva y confirmación deben coincidir antes de llamar al servicio
- Botón "Guardar cambios"
- `useReducer` con acciones `SUBMIT_START`, `SUBMIT_SUCCESS`, `SUBMIT_ERROR`
- Llama a `changePassword()` de `auth.service.ts`
- En `SUBMIT_SUCCESS`: navega atrás con `navigate(-1)` y muestra banner de éxito

### `/invite-group` — InviteGroupPage (modificada)

Contenido existente + cambios:
- Botón "Regenerar código" visible **solo para admin** (`user.role === "admin"`)
- Al pulsar: abre `Modal` de confirmación ("¿Seguro que quieres regenerar el código? El enlace anterior dejará de funcionar")
- Al confirmar: llama a `regenerateInviteCode(groupId)` y llama a `refreshGroup()` para actualizar el código en pantalla
- Estado de loading durante la regeneración

### `/profile/group-settings` — GroupSettingsPage

Solo accesible para admin. Si un no-admin llega a esta ruta (URL directa), redirige a `/profile`.

- TopBar con flecha atrás + título "Configuración del grupo"
- Imagen del grupo con overlay de cámara (sube a Firebase Storage)
- Input nombre del grupo — requerido, máx. 60 caracteres (según reglas de negocio)
- Botón "Guardar cambios"
- `useReducer` para el estado de guardado
- Zona de peligro al final: botón "Eliminar grupo" en rojo
- Al pulsar eliminar: `Modal` de confirmación ("Esta acción es irreversible. Todos los miembros perderán el acceso inmediatamente.")
- Al confirmar: llama a `deleteGroup(groupId, memberUids)` y redirige a `/onboarding/group` (el usuario queda sin grupo)
- **Notificación a miembros:** las notificaciones push están fuera del MVP. Los miembros del grupo sabrán que han sido eliminados cuando abran la app — su `groupId` habrá desaparecido y serán redirigidos al flujo de onboarding para unirse o crear un nuevo grupo. En una versión futura esto se complementaría con una notificación push o un mensaje en pantalla al detectar que el grupo ya no existe.

### `/profile/notifications-settings` — NotificationsSettingsPage ✅ hecho

- TopBar con flecha atrás + título "Notificaciones"
- Sin backend real; el estado se persiste en `localStorage` con clave `notifications-settings-{uid}`

**Sección Eventos:**
- Nuevo evento creado — *Tu falla tiene un nuevo evento*
- Recordatorio de asistencia — *Antes de que expire el plazo*
- Cambios en el evento — *Si se modifica hora, lugar o fecha*
- Evento cancelado — *Si se cancela un evento*

**Sección Feed:**
- Nueva publicación — *Cuando alguien publica en el feed*
- Publicaciones del admin — *Cambios importantes* — **oculto para admin** (ellos son quienes publican)
- Comentarios en tus posts — *Respuestas a tus publicaciones*

**Sección Grupo:**
- Nuevas solicitudes — *Personas que quieren unirse* — **visible solo para admin + organizer**
- Has sido aceptado — *Confirmación de acceso al grupo* — **visible solo para member**
- Cambio de rol — *Cuando tu rol en la falla cambia* — **visible para todos los roles**

Todos los toggles inician en `true`. El estado se recuerda entre sesiones vía `localStorage`.

---

## 5. Traducciones

Namespace nuevo: `profile` en `src/locales/es/profile.json` y `src/locales/ca/profile.json`. ✅ hecho (incluye todas las claves del spec más `inviteGroup`).

### Claves principales

```json
{
  "profile": {
    "myAccount": "Mi cuenta",
    "myGroup": "Mi falla",
    "editProfile": "Editar perfil",
    "changePassword": "Cambiar contraseña",
    "linkedMembers": "Mis vinculados",
    "notifications": "Notificaciones",
    "language": "Idioma",
    "shareAccess": "Compartir acceso",
    "groupSettings": "Configuración del grupo",
    "logout": "Cerrar sesión",
    "logoutConfirmTitle": "Cerrar sesión",
    "logoutConfirmMessage": "¿Seguro que quieres cerrar sesión?",
    "logoutConfirmCancel": "Cancelar",
    "logoutConfirmSubmit": "Cerrar sesión"
  },
  "editProfile": {
    "title": "Editar perfil",
    "changePhoto": "Cambiar foto",
    "firstName": "Nombre",
    "lastName": "Apellidos",
    "email": "Correo electrónico",
    "save": "Guardar cambios",
    "saveSuccess": "Perfil actualizado",
    "saveError": "No se pudo guardar. Inténtalo de nuevo."
  },
  "changePassword": {
    "title": "Cambiar contraseña",
    "currentPassword": "Contraseña actual",
    "newPassword": "Nueva contraseña",
    "confirmPassword": "Confirmar contraseña",
    "save": "Guardar cambios",
    "saveSuccess": "Contraseña actualizada",
    "errorMismatch": "Las contraseñas no coinciden",
    "errorWrongPassword": "La contraseña actual es incorrecta",
    "errorWeakPassword": "La contraseña es demasiado débil",
    "errorDefault": "No se pudo cambiar la contraseña. Inténtalo de nuevo."
  },
  "groupSettings": {
    "title": "Configuración del grupo",
    "groupName": "Nombre del grupo",
    "groupImage": "Imagen del grupo",
    "save": "Guardar cambios",
    "saveSuccess": "Cambios guardados",
    "saveError": "No se pudo guardar. Inténtalo de nuevo.",
    "dangerZone": "Zona de peligro",
    "deleteGroup": "Eliminar grupo",
    "deleteConfirmTitle": "Eliminar grupo",
    "deleteConfirmMessage": "Esta acción es irreversible. Todos los miembros perderán el acceso inmediatamente.",
    "deleteConfirmCancel": "Cancelar",
    "deleteConfirmSubmit": "Eliminar"
  },
  "notificationsSettings": {
    "title": "Notificaciones",
    "sections": {
      "events": "Eventos",
      "feed": "Feed",
      "group": "Grupo"
    },
    "items": {
      "newEvent": "Nuevo evento creado",
      "newEventDesc": "Tu falla tiene un nuevo evento",
      "attendanceReminder": "Recordatorio de asistencia",
      "attendanceReminderDesc": "Antes de que expire el plazo",
      "eventChanges": "Cambios en el evento",
      "eventChangesDesc": "Si se modifica hora, lugar o fecha",
      "eventCancelled": "Evento cancelado",
      "eventCancelledDesc": "Si se cancela un evento",
      "newPost": "Nueva publicación",
      "newPostDesc": "Cuando alguien publica en el feed",
      "adminPost": "Publicaciones del admin",
      "adminPostDesc": "Cambios importantes",
      "postComments": "Comentarios en tus posts",
      "postCommentsDesc": "Respuestas a tus publicaciones",
      "newRequests": "Nuevas solicitudes",
      "newRequestsDesc": "Personas que quieren unirse",
      "accepted": "Has sido aceptado",
      "acceptedDesc": "Confirmación de acceso al grupo"
    }
  },
  "inviteGroup": {
    "regenerateCode": "Regenerar código",
    "regenerateConfirmTitle": "Regenerar código",
    "regenerateConfirmMessage": "El enlace anterior dejará de funcionar. ¿Quieres continuar?",
    "regenerateConfirmCancel": "Cancelar",
    "regenerateConfirmSubmit": "Regenerar"
  }
}
```

---

## 6. Criterios de aceptación

### ProfilePage
- [x] El header muestra el gradiente correcto según el rol del usuario autenticado
- [x] "Compartir acceso" solo aparece para admin y organizer (vía `user.permissions.canShareAccess`)
- [x] "Configuración del grupo" solo aparece para admin (vía `user.permissions.canManageGroup`)
- [x] "Cerrar sesión" muestra modal de confirmación antes de ejecutar logout
- [x] Tras logout, redirige al login

### EditProfilePage
- [x] Nombre y apellidos se guardan en Firestore (`users/{uid}`) y en el array `members` del grupo
- [x] El campo email está visible y deshabilitado
- [x] La foto se puede cambiar y se sube a Firebase Storage
- [x] El perfil en AuthContext y el GroupContext se actualizan tras guardar
- [x] Se muestra feedback de éxito (banner en ProfilePage) y error (inline)

### ChangePasswordPage
- [x] Valida que nueva contraseña y confirmación coinciden antes de llamar al servicio
- [x] Maneja correctamente los errores de Firebase (`wrong-password`, `weak-password`, `same-password`)
- [x] Tras éxito, navega atrás con banner de éxito

### InviteGroupPage
- [x] El botón "Regenerar código" solo es visible para admin
- [x] El botón solo aparece cuando se navega desde el perfil (`fromProfile: true`)
- [x] El modal de confirmación aparece antes de regenerar
- [x] Tras regenerar, el nuevo código se muestra en pantalla

### GroupSettingsPage
- [x] Solo accesible para admin (`user.permissions.canManageGroup`; redirige a `/profile` si no)
- [x] Nombre e imagen del grupo se guardan en Firestore y se refleja en GroupContext
- [x] El modal de eliminar grupo aparece antes de la acción
- [x] Tras eliminar, el usuario queda sin grupo y redirige a `/onboarding/group`
- [x] Los miembros no-admin reciben flag `groupDeleted: true` en Firestore; WelcomePage muestra modal informativo al abrirse

### NotificationsSettingsPage
- [x] Muestra las tres secciones con todos los toggles
- [x] "Nuevas solicitudes" solo aparece para admin y organizer
- [x] "Has sido aceptado" solo aparece para member
- [x] "Publicaciones del admin" oculto para admin
- [x] "Cambio de rol" visible para todos los roles
- [x] El estado de los toggles se persiste en localStorage por usuario
