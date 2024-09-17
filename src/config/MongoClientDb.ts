import { Injectable } from '@nestjs/common';
import { MongoClient } from 'mongodb';

@Injectable()
export default class MongoClientDb extends MongoClient {
  constructor() {
    console.count('client');
    super(process.env.URI_MONGO_DB);
    this.on('connectionCreated', () => {
      console.log('Conectado');
    });
    this.on('error', (e) => {
      console.log('Error', e.message);
    });
  }
}
