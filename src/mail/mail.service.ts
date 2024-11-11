import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { OtpService } from 'src/otp-service/otp.service';

@Injectable()
export class MailService {
  private transporter: Transporter;

  constructor(
    private configService: ConfigService,
    private readonly otpService: OtpService,
  ) {
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

  async sendRegistrationNotification(email: string): Promise<void> {
    try {
      const info = await this.transporter.sendMail({
        from: '"AppBank" <appbankinfo@gmail.com>', // Cambia "Tu Aplicación" por el nombre de tu app
        to: email,
        subject: 'Registro Exitoso',
        text: '¡Bienvenido! Tu registro en nuestra aplicación fue exitoso.',
        html: `
          <h1>¡Bienvenido!</h1>
          <p>Tu registro en nuestra aplicación fue exitoso.</p>
          <p>Ahora puedes iniciar sesión y disfrutar de todos nuestros servicios.</p>
        `,
      });
      console.log('Correo de notificación enviado: %s', info.messageId);
    } catch (error) {
      console.error('Error al enviar el correo de notificación:', error);
    }
  }

  async sendOtpEmail(email: string, otpCode: string): Promise<void> {
    try {
      const info = await this.transporter.sendMail({
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
      console.log('Correo con OTP enviado: %s', info.messageId);
    } catch (error) {
      console.error('Error al enviar el correo de OTP:', error);
      throw new Error('Error al enviar el correo de OTP');
    }
  }

  async sendChangePasswordEmail(email: string, token: string) {
    try {
      // Construye el enlace completo con el token
      const recoveryLink = `http://localhost:4000/forms/newpass?t=${token}`;

      const info = await this.transporter.sendMail({
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

      console.log('Correo con enlace enviado: %s', info.messageId);
    } catch (error) {
      console.error('Error al enviar el correo de recuperación:', error);
      throw new Error('Error al enviar el correo de recuperación');
    }
  }
}
//http://localhost:4000/forms/recoverpass?t=<token>
