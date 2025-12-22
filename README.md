 # Alarma-v1 (Front-end Capacitor)

 Aplicación móvil y web para monitoreo y control de un sistema de alarma. Desarrollada en Angular 19 con integración de Capacitor 7 para empaquetar a Android, usando PrimeNG para UI y TailwindCSS para estilos. Se conecta a un backend REST y a un servidor de WebSockets (Socket.IO) para control en tiempo real.

 ## Funcionalidades clave

 - **Autenticación**: flujo de acceso/registro y verificación.
 - **Dashboard**: vista principal con estado de la alarma, acciones rápidas y secciones (sensores, historial, perfil, etc.).
 - **Tiempo real**: integración con Socket.IO para eventos de alarma y actualizaciones instantáneas.
 - **Historial**: timeline de eventos de la alarma.
 - **Gestión de sitios/sensores**: visualización y control.
 - **Diseño responsivo**: soporte móvil y desktop. Dark mode soportado en estilos.

 ## Tecnologías utilizadas

 - **Framework**: Angular 19 (standalone APIs, rutas lazy-loaded).
 - **Mobile runtime**: Capacitor 7 (`@capacitor/core`, `@capacitor/android`).
 - **UI**: PrimeNG 19, PrimeIcons, `@primeng/themes`, TailwindCSS 3 (`tailwindcss-primeui`).
 - **Estado/reactividad**: RxJS 7.
 - **Realtime**: `socket.io-client` 4.
 - **Build & tooling**: Angular CLI 19, ESLint, Prettier, TypeScript 5.

 ## Estructura del proyecto

 Ruta principal: `src/`

 - **src/app/**
   - **app.routes.ts**: definición de rutas principales con lazy loading y guards (`authGuard`, `dashboardGuard`).
   - **auth/**: módulo/área de autenticación (componentes, rutas propias, guards).
   - **dashboard/**: módulo/área principal (home, historial, sensores, perfil, etc.).
   - **shared/**: componentes, páginas y utilitarios compartidos (incluye `verification`).
   - **env.ts**: constantes de configuración (API/Socket, pruebas).
 - **src/styles.scss**: hoja de estilos global (integra Tailwind y temas PrimeNG).
 - **public/**: recursos estáticos copiados al build.

 Capacitor está configurado en:

 - `capacitor.config.ts` (webDir apunta a `dist/front-end-capacitor-v1.0.0/browser`).
 - Proyecto Android en `android/`.

 ## Scripts disponibles (npm)

 - `npm start`: inicia servidor de desarrollo (Angular dev server).
 - `npm run build`: compila para producción.
 - `npm run watch`: compila en modo watch (development).
 - `npm test`: ejecuta pruebas con Karma/Jasmine.

 ## Ejecución en desarrollo (web)

 ```bash
 npm install
 npm start
 # abre http://localhost:4200
 ```

 Si usas endpoints locales, ajusta `src/app/env.ts`.

 ## Build de producción (web)

 ```bash
 npm run build
 # salida en dist/front-end-capacitor-v1.0.0
 ```

 ## Android (Capacitor)

 Asegúrate de tener Android Studio y SDK instalados.

 ```bash
 # 1) Compilar la app web
 npm run build

 # 2) Sincronizar artefactos web con Capacitor
 npx cap sync android

 # 3) Abrir en Android Studio
 npx cap open android
 ```

 - El `webDir` ya está configurado: `dist/front-end-capacitor-v1.0.0/browser`.
 - Puedes ejecutar en emulador/dispositivo desde Android Studio.

 ## Estilos y UI

 - TailwindCSS configurado (ver `tailwind.config.js`).
 - PrimeNG + PrimeIcons integrados con temas desde `@primeng/themes`.
 - Diseño responsivo con soporte de dark mode.

 ## Calidad de código y formateo

 - ESLint para linting (`.eslintrc.json`).
 - Prettier para formateo.
 - Recomendado: ejecutar linters/prettier antes de commits.

 ## Notas

 - Rutas principales:
   - `/auth` (autenticación, protegido por `authGuard`).
   - `/dashboard` (área principal, protegido por `dashboardGuard`).
   - `/verification` (página compartida de verificación).
 - Realtime: `socket.io-client` configurado hacia `SOCKET_URL` y `SOCKET_PATH`.
