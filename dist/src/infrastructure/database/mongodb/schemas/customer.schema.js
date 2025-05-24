"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const customerSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        required: true,
        unique: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true, // Isso gerencia automaticamente createdAt e updatedAt
    versionKey: false // Remove o campo __v
});
// Adiciona índices
customerSchema.index({ email: 1 }, { unique: true });
customerSchema.index({ phone: 1 }, { unique: true, sparse: true });
customerSchema.index({ name: 1 });
// Middleware para atualizar updatedAt antes de salvar
customerSchema.pre('findOneAndUpdate', function (next) {
    this.set({ updatedAt: new Date() });
    next();
});
exports.CustomerModel = mongoose_1.default.model('Customer', customerSchema);
