// Implementa o consumidor de mensagens Kafka
import { Kafka, Consumer, EachMessagePayload } from 'kafkajs';

export class KafkaConsumerService {
  private consumer: Consumer;

  constructor(
    kafka: Kafka,
    private readonly groupId: string
  ) {
    this.consumer = kafka.consumer({ groupId });
    this.connect();
  }

  private async connect(): Promise<void> {
    try {
      await this.consumer.connect();
      console.log(`Consumer ${this.groupId} connected to Kafka`);
    } catch (error) {
      console.error('Failed to connect consumer', error);
    }
  }

  async subscribe(topics: string[]): Promise<void> {
    await Promise.all(
      topics.map(topic => this.consumer.subscribe({ topic, fromBeginning: true }))
    );
  }

  async consume(handler: (payload: EachMessagePayload) => Promise<void>): Promise<void> {
    await this.consumer.run({
      eachMessage: async (payload) => {
        try {
          await handler(payload);
        } catch (error) {
          console.error('Error processing message', error);
        }
      },
    });
  }

  async disconnect(): Promise<void> {
    await this.consumer.disconnect();
  }
}