import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  private transporter: Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('MAIL_HOST'),
      port: this.configService.get<number>('MAIL_PORT'),
      secure: true,
      auth: {
        user: this.configService.get<string>('MAIL_USER'),
        pass: this.configService.get<string>('MAIL_PASS'),
      },
    });
  }

  async sendRegistrationNotification(
    email: string,
    username: string,
  ): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: '"AppBank" <appbankinfo@gmail.com>', // Cambia "Tu Aplicación" por el nombre de tu app
        to: email,
        subject: 'Registro Exitoso',
        text: `¡Bienvenido! Tu registro en nuestra aplicación fue exitoso.`,
        html: `
          <h1>¡Bienvenido ${username}!</h1>
          <p>Tu registro en nuestra aplicación fue exitoso.</p>
          <p>Ahora puedes iniciar sesión y disfrutar de todos nuestros servicios.</p>
        `,
      });
      //console.log('Correo de notificación enviado: %s', info.messageId);
    } catch (error) {
      throw error;
    }
  }

  async sendOtpEmail(email: string, otpCode: string): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: '"AppBank" <appbankinfo@gmail.com>',
        to: email,
        subject: 'Código de Verificación OTP',
        text: `Tu código de verificación es: ${otpCode}`,
        html: `
          <h1>Verificación de Cuenta</h1>
          <p>Tu código de verificación es: <strong>${otpCode}</strong></p>
          <p>Ingresa este código en la aplicación para activar tu cuenta.</p>
        `,
      });
      // console.log('Correo con OTP enviado: %s', info.messageId);
    } catch (error) {
      throw error;
    }
  }

  async sendChangePasswordEmail(email: string, token: string) {
    try {
      // Construye el enlace completo con el token
      const recoveryLink = `http://localhost:4000/forms/newpass?t=${token}`;
      await this.transporter.sendMail({
        from: '"AppBank" <appbankinfo@gmail.com>',
        to: email,
        subject: 'Enlace para reestablecer contraseña',
        text: `Tu enlace para reestablecimiento de contraseña es: ${recoveryLink}`,
        html: `
          <h1>Reestablecimiento de Contraseña</h1>
          <p>Haz clic en el botón de abajo para reestablecer tu contraseña:</p>
          <a href="${recoveryLink}" style="
            display: inline-block;
            padding: 15px 25px;
            font-size: 16px;
            color: #ffffff;
            background-color: #6a0dad;
            border-radius: 5px;
            text-decoration: none;
            font-weight: bold;
            margin-top: 10px;
          ">Reestablecer Contraseña</a>
          <p>Este enlace te redirigirá para cambiar tu contraseña.</p>
        `,
      });

      // console.log('Correo con enlace enviado: %s', info.messageId);
    } catch (error) {
      throw error;
    }
  }
  async notifyTransaction(
    email: string,
    amount: number,
    accountNumber: string,
    receptorAccountNumber: string,
    date: Date,
  ): Promise<void> {
    try {
      const formattedDate = date.toLocaleString(); // Convierte la fecha a un formato legible
      await this.transporter.sendMail({
        from: '"AppBank" <appbankinfo@gmail.com>',
        to: email,
        subject: 'Notificación de Transacción Realizada',
        text: `Se ha realizado una transacción desde tu cuenta.`,
        html: `
  <div style="font-family: Arial, sans-serif; background-color: white; padding: 20px; color: white;">
    <div style="max-width: 600px; margin: auto; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); overflow: hidden;">
      <!-- Encabezado -->
      <div style="background-color: black; color:white; padding: 20px; text-align: center;">
        <h1 style="margin: 0; font-size: 24px;">Notificación de Transacción</h1>
      </div>

      <!-- Contenido -->
      <div style="padding: 20px; background-color: #ffffff; color: black;">
        <p>Estimado cliente,</p>
        <p>Te informamos que se ha realizado una transacción desde tu cuenta con los siguientes detalles:</p>
        
        <ul style="list-style: none; padding: 0;">
          <li style="margin-bottom: 8px;"><strong style="color: black;">Monto:</strong> $${amount}</li>
          <li style="margin-bottom: 8px;"><strong style="color: black;">Producto origen:</strong> ${accountNumber}</li>
          <li style="margin-bottom: 8px;"><strong style="color: black;">Producto destino:</strong> ${receptorAccountNumber}</li>
          <li style="margin-bottom: 8px;"><strong style="color: black;">Fecha:</strong> ${formattedDate}</li>
        </ul>
        
        <p style="margin-top: 20px;">Si no reconoces esta transacción, contacta a nuestro equipo de soporte de inmediato.</p>
      </div>

      <!-- Pie de página -->
      <div style="background-color: black; color: white; padding: 15px; text-align: center;">
        <p style="margin: 0;" > Saludos<br><strong>AppBank</strong></p>
      </div>
    </div>
  </div>`,
      });

      // console.log('Correo de notificación de transacción enviado');
    } catch (error) {
      throw error;
    }
  }
}
