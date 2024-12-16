import {
  VersioningType,
  VersioningOptions,
  ValidationPipeOptions,
  BadRequestException,
} from '@nestjs/common';
import { SessionOptions } from 'express-session';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { HelmetOptions } from 'helmet';

export const CONFIG_CORS: CorsOptions = {
  origin: ['http://localhost:4000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

export const CONFIG_VERSIONING: VersioningOptions = {
  type: VersioningType.URI,
  defaultVersion: '1',
};

export const CONFIG_VALIDATION_PIPE: ValidationPipeOptions = {
  transform: true,
  exceptionFactory(errors) {
    const errorsMessages: string[] = errors
      .map((e) => Object.values(e.constraints))
      .flat(1);
    const msg: string[] | string =
      errorsMessages.length === 1 ? errorsMessages[0] : errorsMessages;
    return new BadRequestException({
      error: true,
      msg,
    });
  },
};

export const CONFIG_HELMET: HelmetOptions = {
  xPoweredBy: true,
};

export const CONFIG_SESSION: SessionOptions = {
  name: 's.id',
  secret: process.env.SECRET_KEY_SESSION,
  resave: false,
  saveUninitialized: false,
  rolling: true, // Permite refrescar la sesion en caso de una interaccion
  cookie: {
    httpOnly: true,
    secure: false, //Solo desarrollo
    priority: 'high',
    maxAge: 3600000, // Expira en 1 horas si no hay interaccion
  },
};
