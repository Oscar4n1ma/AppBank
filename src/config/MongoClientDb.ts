import { Injectable } from '@nestjs/common';
import { MongoClient } from 'mongodb';

@Injectable()
export default class MongoClientDb extends MongoClient {
  constructor() {
    super(process.env.URI_MONGO_DB, { maxPoolSize: 100, minPoolSize: 50 });
    this.on('connectionCreated', (x) => {
      console.log('Conexion creada', x.connectionId);
    });
    this.on('error', (e) => {
      console.log('Error', e.message);
    });
  }
}
