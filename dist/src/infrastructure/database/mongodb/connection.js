"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectToDatabase = connectToDatabase;
exports.closeDatabase = closeDatabase;
// src/infrastructure/database/mongodb/connection.ts
const mongoose_1 = __importDefault(require("mongoose"));
const environment_1 = require("../../config/environment");
let isConnected = false;
async function connectToDatabase() {
    if (isConnected) {
        console.log('Usando conexão existente com MongoDB');
        return;
    }
    try {
        const mongoUri = environment_1.config.mongodb.uri;
        console.log('Tentando conectar ao MongoDB com URI:', mongoUri);
        mongoose_1.default.set('strictQuery', false);
        await mongoose_1.default.connect(mongoUri);
        isConnected = true;
        console.log('Conectado ao MongoDB com sucesso!');
        // Registra eventos de conexão
        mongoose_1.default.connection.on('error', (err) => {
            console.error('Erro na conexão MongoDB:', err);
            isConnected = false;
        });
        mongoose_1.default.connection.on('disconnected', () => {
            console.log('MongoDB desconectado');
            isConnected = false;
        });
        // Listar todas as coleções
        if (mongoose_1.default.connection.db) {
            try {
                const collections = await mongoose_1.default.connection.db.listCollections().toArray();
                console.log('Coleções disponíveis:', collections.map(c => c.name));
            }
            catch (err) {
                console.warn('Não foi possível listar as coleções:', err);
            }
        }
        else {
            console.warn('Conexão com o banco de dados não está totalmente estabelecida ainda');
        }
    }
    catch (error) {
        console.error('Erro ao conectar ao MongoDB:', error);
        isConnected = false;
        throw error;
    }
}
async function closeDatabase() {
    if (mongoose_1.default.connection.readyState !== 0) {
        await mongoose_1.default.connection.close();
        isConnected = false;
        console.log('Conexão com MongoDB fechada');
    }
}
