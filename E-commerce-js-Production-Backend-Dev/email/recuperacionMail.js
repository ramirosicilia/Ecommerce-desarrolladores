
import nodemailer from "nodemailer"; 
import dotenv, { config } from 'dotenv';

config(); 

const urlBack=process.env.URL_BACKEND

const transportes = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.USER_NAME,
        pass: process.env.USER_PASSWORD
    }
});

export async function validarMail(direccion, token) { 
    return transportes.sendMail({
        from: process.env.USER_EMAIL,
        to: direccion, 
        subject: 'Hola, este es un mail de recuperacion de cuenta!!!',
        html: cuerpoMail(token)
    });
}  



function cuerpoMail(token) { 
    return ` 
        <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verificación de Email</title> 

    <style> 
        /* Estilos generales */
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f9f9f9;
            height: 100vh;
        }

        .email-container {
            max-width: 600px; 
            margin: 20px auto;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            overflow: hidden;
            border: 1px solid #ddd;
        }

        .email-header {
            background-color: #4caf50;
            color: white;
            text-align: center;
            padding: 20px 0;
        }

        .email-header h2 {
            margin: 0;
            font-size: 24px;
        }

        .email-body {
            padding: 20px;
            color: #333;
            line-height: 1.6;
        }

        .email-body p {
            margin: 10px 0;
        }

        .email-body a {
            display: inline-block;
            text-decoration: none;
            background-color: #4caf50;
            color: white;
            padding: 9px 20px;
            font-size: 16px;
            border-radius: 5px;
            box-shadow: 0 4px 8px rgba(76, 175, 80, 0.3);
            transition: background-color 0.3s, transform 0.2s;
        }

        .email-body a:hover {
            background-color: #45a049;
            transform: scale(1.05);
        }

        .email-footer {
            text-align: center;
            padding: 10px;
            background-color: #f1f1f1;
            font-size: 14px;
            color: #666;
        }
    </style>
</head>
<body> 

    <div class="email-container">
        <div class="email-header">
            <h2>Verifica tu Email</h2>
        </div>
        <div class="email-body">
            <p>Hola,</p>
            <p>Por favor, confirma tu dirección de email para completar el proceso de registro en nuestro sitio.</p>
            <p>Al hacer clic en el botón a continuación, aceptas nuestras políticas de privacidad</a>.</p>
            <a href="${urlBack}/verificar-email/${token}">Aceptar</a>
        </div>
        <div class="email-footer">
            <p>&copy; 2025 E-commerce. Todos los derechos reservados.</p>
        </div>
    </div>
    
</body>
</html>

    `; 
}
