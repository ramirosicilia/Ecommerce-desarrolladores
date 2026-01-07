# 💳 Ecommerce JS - Microservicio de Pagos en Producción

Este repositorio contiene el **microservicio de pagos** del sistema E-commerce JS, preparado para funcionar de forma modular y profesional en producción.

Incluye integraciones robustas con:

- ✅ Mercado Pago (SDK oficial)
- ✅ Supabase (para base de datos y storage)
- ✅ Gmail + Nodemailer (para envío de correos)
- ✅ Cloudinary (si se requiere acceder a imágenes externas)

Todo el flujo está documentado paso a paso con **capturas de pantalla organizadas en carpetas específicas**.

---

## 📦 Tecnologías utilizadas

- **Node.js + Express**
- **Mercado Pago SDK oficial**
- **Supabase PostgreSQL + API REST**
- **Nodemailer + Gmail App Password**
- **Cloudinary (opcional)**
- `.env` para manejo de credenciales y configuración

---

## 📁 Estructura del proyecto

📦 Ecommerce-Production-Payments-Dev
┣ 📂imagenesEmail ← Capturas sobre cómo crear App Password en Gmail
┣ 📂imagenesSupabase ← Capturas para obtener credenciales de Supabase
┣ 📂mercadoImagenes ← Capturas para instalar y usar Mercado Pago correctamente
┣ 📄DB.js ← Lógica de conexión con Supabase
┣ 📄email.js ← Envío de correos con Nodemailer
┣ 📄mercadoPago.js ← Generación de pagos y manejo de Webhooks
┣ 📄.env ← Variables de entorno (no se incluye en producción)
┣ 📄package.json ← Configuración de dependencias y scripts
┗ 📄README.md ← Este archivo

yaml
Copiar
Editar

---

## ⚙️ Instalación

1. Cloná el repositorio:

```bash
git clone https://github.com/tu-usuario/Ecommerce-Production-Payments-Dev.git
Instalá las dependencias:

bash
Copiar
Editar
cd Ecommerce-Production-Payments-Dev
npm install
Configurá tu archivo .env con las variables necesarias (ver más abajo).

Iniciá el servidor:

bash
Copiar
Editar
node mercadoPago.js
🌐 Variables de entorno (.env)
env
Copiar
Editar
# Supabase
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_KEY=eyJhbGciOiJI...

# Mercado Pago
MP_ACCESS_TOKEN=TEST-1234567890abcdef...

# Gmail
EMAIL_USER=tuemail@gmail.com
EMAIL_PASS=contraseña_de_aplicación_generada

# Cloudinary (opcional si se requieren imágenes externas)
CLOUDINARY_CLOUD_NAME=mi-cloud
CLOUDINARY_API_KEY=123456789
CLOUDINARY_API_SECRET=secreto123
📝 ¿Dónde conseguir estos datos?
📂 imagenesSupabase/ → muestra dónde están SUPABASE_URL y SUPABASE_KEY

📂 mercadoImagenes/ → explica cómo obtener el ACCESS_TOKEN de Mercado Pago

📂 imagenesEmail/ → guía paso a paso para crear la contraseña de aplicación de Gmail

📂 cloudImages/ (si la agregás) → cómo obtener CLOUD_NAME, API_KEY, API_SECRET

💳 Mercado Pago – Flujo y lógica
Toda la lógica de pagos está implementada en mercadoPago.js:

Generación de preferencia de pago (/create_preference)

Redirección automática hacia el checkout de Mercado Pago

Webhook (/webhook) para validar pagos y registrar transacciones

Registro automático de pedidos en Supabase

Envío de correo de confirmación al cliente

🧪 Webhook
http
Copiar
Editar
POST /webhook
Este endpoint recibe notificaciones de Mercado Pago

Valida y actualiza el estado del pago

Dispara el correo con Nodemailer al comprador

Podés configurarlo en el panel de desarrollador de MP.

📧 Envío de correos con Gmail
email.js se encarga de enviar correos tras cada compra exitosa.

Usa Nodemailer con credenciales seguras mediante App Password.

Configuración ilustrada con capturas en imagenesEmail/.

🔗 Supabase – Base de datos
DB.js se conecta a Supabase vía API REST utilizando la SUPABASE_KEY.

Permite registrar pagos, usuarios y pedidos directamente en la tabla que uses.

Totalmente desacoplado, ideal para microservicio.

☁️ Cloudinary (opcional)
Si tu frontend o backend necesita mostrar imágenes públicas, podés incluir Cloudinary.

Agregá cloudImages/ con capturas y configurá tus credenciales en .env.

🧩 Integración con el backend o frontend principal
Este módulo puede integrarse fácilmente con cualquier frontend o backend principal vía HTTP REST, por ejemplo:

🟦 Desde el frontend
javascript
Copiar
Editar
fetch('https://tuservidor.com/create_preference', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    items: carrito,
    usuario: userId,
    total: montoTotal
  })
})
.then(res => res.json())
.then(data => {
  window.location.href = data.init_point; // Redirige al checkout de MP
});
🟧 Desde el backend principal
javascript
Copiar
Editar
const axios = require('axios');

const generarPago = async () => {
  const { data } = await axios.post('https://tuservicio.com/create_preference', {
    items,
    usuario,
    total
  });

  return data.init_point;
};
🔒 Seguridad
.env está correctamente ignorado mediante .gitignore.

No se suben claves sensibles al repo.

Todas las capturas que acompañan el proyecto son solo referenciales y no muestran datos reales.

