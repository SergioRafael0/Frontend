# Frontend — Información del Proyecto

## Stack
- **React 19** + Vite 8 + Tailwind CSS 4
- **axios** para llamadas HTTP al BFF
- **react-router-dom** 7 para enrutamiento
- **Vitest 4** + **Testing Library** para tests unitarios

## Puerto
- **80** (Docker) / `localhost:5173` (desarrollo Vite)

## Arquitectura
Frontend React que consume el BFF (`/api/bff`) como único punto de entrada. SPA con autenticación JWT vía cookies HttpOnly.

## Estructura de directorios
```
src/
├── App.jsx                          # Routes + AuthProvider
├── main.jsx                         # Entry point
├── context/
│   └── AuthContext.jsx              # Auth state (login, logout, getRole, user, loading)
├── services/
│   └── api.js                       # Axios instance (baseURL: /api/bff, interceptor 401)
├── utils/
│   ├── rutUtils.js                  # formatearRut()
│   └── errorHandler.js              # getErrorMessage()
├── components/
│   ├── common/
│   │   ├── Sidebar.jsx              # Menú por rol (ADMIN/DOCENTE/ESTUDIANTE)
│   │   ├── Navbar.jsx               # Barra superior con perfil y logout
│   │   ├── PrivateRoute.jsx         # Guard de autenticación y roles
│   │   └── PerfilModal.jsx          # Modal de datos del usuario
│   └── layouts/
│       └── MainLayout.jsx           # Layout principal (Sidebar + Navbar + Outlet)
├── pages/
│   ├── login/
│   │   ├── Login.jsx                # Formulario de inicio de sesión
│   │   └── Register.jsx             # Formulario de registro con RUT
│   ├── admin/
│   │   ├── Dashboard.jsx            # Dashboard ADMIN con estadísticas
│   │   ├── GestionUsuarios.jsx      # CRUD usuarios
│   │   ├── GestionCursos.jsx        # CRUD cursos
│   │   ├── GestionAsignaturas.jsx   # CRUD asignaturas
│   │   ├── GestionMatriculas.jsx    # CRUD matrículas
│   │   ├── GestionAsistencias.jsx   # CRUD asistencias
│   │   ├── GestionAnotaciones.jsx   # CRUD anotaciones
│   │   └── GestionCalificaciones.jsx# CRUD calificaciones
│   ├── docente/
│   │   ├── CursosDocente.jsx        # Cursos del docente
│   │   ├── MisAsignaturas.jsx       # Asignaturas del docente
│   │   ├── RegistroAsistencia.jsx   # Registro de asistencia
│   │   ├── RegistroAnotaciones.jsx  # Registro de anotaciones
│   │   └── RegistroNotas.jsx        # Registro de notas
│   └── estudiante/
│       ├── MisCursos.jsx            # Cursos del estudiante
│       ├── MiAsistencia.jsx         # Asistencia del estudiante
│       └── MisNotas.jsx             # Notas del estudiante
```

## Patrones de diseño implementados

| Patrón | Implementación |
|--------|---------------|
| **Module Pattern** | ES Modules en todos los archivos |
| **Singleton** | Instancia única axios en `services/api.js`, AuthContext único |
| **Observer** | `AuthContext` via `createContext/useContext` (15 componentes suscritos) |
| **HOC / Guard** | `PrivateRoute` para control de acceso por rol |
| **Proxy** | Interceptor axios para redirect 401 → `/login` |

## Tests

**40 tests**, 8 archivos:

| Archivo | Tests | ¿Qué prueba? |
|---------|-------|-------------|
| `utils/rutUtils.test.js` | 8 | `formatearRut()`: formateo, K, truncado, vacío |
| `utils/errorHandler.test.js` | 9 | `getErrorMessage()`: todos los códigos HTTP, mensajes, fallback |
| `context/AuthContext.test.jsx` | 7 | login, logout, sessionStorage, getRole, error provider |
| `components/common/PrivateRoute.test.jsx` | 4 | auth guard, redirect, loading, role check |
| `components/common/Sidebar.test.jsx` | 4 | menús por rol (ADMIN 8, DOCENTE 6, ESTUDIANTE 4, vacío) |
| `components/common/Navbar.test.jsx` | 4 | user initials, logout, PerfilModal open, null sin user |
| `components/common/PerfilModal.test.jsx` | 3 | user data, close button, null sin user |
| `components/layouts/MainLayout.test.jsx` | 1 | renderiza Sidebar + Navbar + Outlet |

**Stack:** Vitest 4, Testing Library (react, jest-dom, user-event), jsdom.

**Ejecución:**
```bash
npm test        # 40 tests, todos pasan
npm run watch   # modo watch
```

## Consumo de API
- Todas las llamadas pasan por el BFF (`/api/bff`)
- Autenticación vía cookie HttpOnly (`jwt-cookie`)
- Interceptor 401 redirige a `/login`

## Configuración
```js
// vite.config.js
export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: { globals: true, environment: 'jsdom', setupFiles: './src/test-setup.js' },
})
```
