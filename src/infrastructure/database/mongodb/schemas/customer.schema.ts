import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema({
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
customerSchema.pre('findOneAndUpdate', function(next) {
  this.set({ updatedAt: new Date() });
  next();
});

export const CustomerModel = mongoose.model('Customer', customerSchema);