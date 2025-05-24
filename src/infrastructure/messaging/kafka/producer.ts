// src/infrastructure/messaging/mock-producer.service.ts
export interface ProducerService {
  sendMessage(topic: string, message: any): Promise<void>;
}

export class MockProducerService implements ProducerService {
  async sendMessage(topic: string, message: any): Promise<void> {
    console.log(`[MOCK] Sending message to topic ${topic}:`, JSON.stringify(message, null, 2));
  }
}