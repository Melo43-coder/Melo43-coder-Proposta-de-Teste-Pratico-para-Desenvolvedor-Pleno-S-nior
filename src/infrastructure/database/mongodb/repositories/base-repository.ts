// Implementação concreta do repositório base usando MongoDB
import { Model } from 'mongoose';
import { BaseRepository } from '../../../../domain/repositories/base-repository.interface';
import { BaseEntity } from '../../../../domain/entities/base-entity';

export abstract class MongoBaseRepository<T extends BaseEntity> implements BaseRepository<T> {
  constructor(protected readonly model: Model<any>) {}

  async findById(id: string): Promise<T | null> {
    const document = await this.model.findById(id).exec();
    return document ? this.mapToEntity(document) : null;
  }

  async findAll(): Promise<T[]> {
    const documents = await this.model.find().exec();
    return documents.map(doc => this.mapToEntity(doc));
  }

  async create(entity: T): Promise<T> {
    const document = new this.model(this.mapToDocument(entity));
    const savedDoc = await document.save();
    return this.mapToEntity(savedDoc);
  }

  async update(id: string, entity: Partial<T>): Promise<T | null> {
    const updateData = this.mapToDocument(entity as T);
    const updatedDoc = await this.model.findByIdAndUpdate(
      id,
      { ...updateData, updatedAt: new Date() },
      { new: true }
    ).exec();
    
    return updatedDoc ? this.mapToEntity(updatedDoc) : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.model.findByIdAndDelete(id).exec();
    return !!result;
  }

  protected abstract mapToEntity(document: any): T;
  protected abstract mapToDocument(entity: T): any;
}