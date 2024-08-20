// import { PrismaClient } from "@prisma/client";
import { Kafka } from "kafkajs";


// const client = new PrismaClient();
const TOPIC_NAME = "zap-events";
const kafka = new Kafka({
    clientId: "outbox-processor",
    brokers: ["localhost:9092"]
});

async function main(){
    const consumer = kafka.consumer({groupId: 'main-worker'});
    await consumer.connect();
    await consumer.subscribe({ topic: TOPIC_NAME, fromBeginning: true });
    await consumer.run({
        autoCommit: false,
        eachMessage: async ({topic, partition, message})=> {
            console.log({
                value: message.value?.toString(),
                topic,
                offset: message.offset,
                timestamp: message.timestamp,
                key: message.key?.toString(),
                headers: message.headers,
                partition,
            });
            // send to the zap service
            await new Promise(r => setTimeout(r, 1000));
        }
    });
}
main();