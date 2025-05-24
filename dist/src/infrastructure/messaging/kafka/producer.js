"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockProducerService = void 0;
class MockProducerService {
    async sendMessage(topic, message) {
        console.log(`[MOCK] Sending message to topic ${topic}:`, JSON.stringify(message, null, 2));
    }
}
exports.MockProducerService = MockProducerService;
