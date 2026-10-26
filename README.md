# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.


## Cómo verlo funcionando

En una terminal (PowerShell):

cd C:\Users\HOME\finanzas-frontend
npm run dev

Abre en el navegador la dirección que aparece (normalmente http://localhost:5173). Para entrar puedes usar cualquier correo y contraseña, porque por ahora la app usa datos de prueba. Verás:
- Login con validación de los campos
- Dashboard con 4 indicadores, un gráfico de barras de ingresos contra gastos y un gráfico circular de gastos por categoría
- Ingresos y gastos con una tabla de movimientos
- Deudas con una tarjeta por cada deuda
- Presupuestos, Simulador y Asistente IA, que por ahora dicen "en construcción"
- Un menú lateral que en el celular se convierte en un botón ☰, así que ya se adapta a móvil (responsive)