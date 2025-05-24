"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoBaseRepository = void 0;
class MongoBaseRepository {
    constructor(model) {
        this.model = model;
    }
    async findById(id) {
        const document = await this.model.findById(id).exec();
        return document ? this.mapToEntity(document) : null;
    }
    async findAll() {
        const documents = await this.model.find().exec();
        return documents.map(doc => this.mapToEntity(doc));
    }
    async create(entity) {
        const document = new this.model(this.mapToDocument(entity));
        const savedDoc = await document.save();
        return this.mapToEntity(savedDoc);
    }
    async update(id, entity) {
        const updateData = this.mapToDocument(entity);
        const updatedDoc = await this.model.findByIdAndUpdate(id, { ...updateData, updatedAt: new Date() }, { new: true }).exec();
        return updatedDoc ? this.mapToEntity(updatedDoc) : null;
    }
    async delete(id) {
        const result = await this.model.findByIdAndDelete(id).exec();
        return !!result;
    }
}
exports.MongoBaseRepository = MongoBaseRepository;
