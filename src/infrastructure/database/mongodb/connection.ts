// src/infrastructure/database/mongodb/connection.ts
import mongoose from 'mongoose';
import { config } from '../../config/environment';

let isConnected = false;

export async function connectToDatabase(): Promise<void> {
  if (isConnected) {
    console.log('Usando conexão existente com MongoDB');
    return;
  }

  try {
    const mongoUri = config.mongodb.uri;
    console.log('Tentando conectar ao MongoDB com URI:', mongoUri);
    
    mongoose.set('strictQuery', false);
    
    await mongoose.connect(mongoUri);
    
    isConnected = true;
    console.log('Conectado ao MongoDB com sucesso!');
    
    // Registra eventos de conexão
    mongoose.connection.on('error', (err) => {
      console.error('Erro na conexão MongoDB:', err);
      isConnected = false;
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB desconectado');
      isConnected = false;
    });
    
    // Listar todas as coleções
    if (mongoose.connection.db) {
      try {
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('Coleções disponíveis:', collections.map(c => c.name));
      } catch (err) {
        console.warn('Não foi possível listar as coleções:', err);
      }
    } else {
      console.warn('Conexão com o banco de dados não está totalmente estabelecida ainda');
    }
    
  } catch (error) {
    console.error('Erro ao conectar ao MongoDB:', error);
    isConnected = false;
    throw error;
  }
}

export async function closeDatabase(): Promise<void> {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
    isConnected = false;
    console.log('Conexão com MongoDB fechada');
  }
}