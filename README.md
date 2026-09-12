# Jazz Barber

Software sencillo para gestionar la barbería: agenda de citas, lista de servicios con precios y base de clientes. Hecho en HTML, CSS y JavaScript puro — sin frameworks, sin instalación, sin necesidad de un servidor.

## Funciones

- **Agenda**: crear y eliminar citas del día (cliente, servicio, barbero, hora).
- **Servicios**: crear y eliminar servicios con su precio y duración.
- **Clientes**: registrar clientes y ver su número de visitas.
- Los datos se guardan en el navegador (`localStorage`), así que persisten aunque cierres la página.
- Se puede "agregar a la pantalla de inicio" del celular para que se abra como una app.

## Cómo mostrarla en tu celular ahora mismo

**Opción rápida (sin GitHub):** abre la carpeta en tu computador, comprime `index.html`, `style.css`, `app.js`, `manifest.json` y `logo.png` en un solo lugar y ábrelos con Live Server o cualquier extensión similar, o súbelos directo a GitHub (ver abajo) y usa GitHub Pages — es la forma más simple de tener un link que abra en cualquier celular.

## Cómo subirla a GitHub

1. Crea un repositorio nuevo en GitHub, por ejemplo `barberpro`.
2. Desde la carpeta del proyecto:
   ```bash
   git init
   git add .
   git commit -m "Primera versión: agenda, servicios y clientes"
   git branch -M main
   git remote add origin https://github.com/TU_USUARIO/barberpro.git
   git push -u origin main
   ```
3. Activa GitHub Pages: en el repositorio, ve a **Settings → Pages**, en "Source" elige la rama `main` y la carpeta `/ (root)`, guarda.
4. En un par de minutos tendrás un link tipo `https://TU_USUARIO.github.io/barberpro/` que puedes abrir directamente desde el navegador de tu celular y mostrar en la reunión.
5. Desde el celular, en el navegador, puedes usar "Agregar a pantalla de inicio" para que quede como ícono de app.

## Próximos pasos sugeridos

- Conectar una base de datos real (Firebase o Supabase) para que los datos se compartan entre dispositivos, no solo en el navegador local.
- Agregar notificación de confirmación por WhatsApp.
- Dashboard de ingresos del día/semana.
- Login para que cada barbero vea solo su agenda.
