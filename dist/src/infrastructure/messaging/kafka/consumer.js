"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KafkaConsumerService = void 0;
class KafkaConsumerService {
    constructor(kafka, groupId) {
        this.groupId = groupId;
        this.consumer = kafka.consumer({ groupId });
        this.connect();
    }
    async connect() {
        try {
            await this.consumer.connect();
            console.log(`Consumer ${this.groupId} connected to Kafka`);
        }
        catch (error) {
            console.error('Failed to connect consumer', error);
        }
    }
    async subscribe(topics) {
        await Promise.all(topics.map(topic => this.consumer.subscribe({ topic, fromBeginning: true })));
    }
    async consume(handler) {
        await this.consumer.run({
            eachMessage: async (payload) => {
                try {
                    await handler(payload);
                }
                catch (error) {
                    console.error('Error processing message', error);
                }
            },
        });
    }
    async disconnect() {
        await this.consumer.disconnect();
    }
}
exports.KafkaConsumerService = KafkaConsumerService;
