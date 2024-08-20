"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
// import { PrismaClient } from "@prisma/client";
const kafkajs_1 = require("kafkajs");
// const client = new PrismaClient();
const TOPIC_NAME = "zap-events";
const kafka = new kafkajs_1.Kafka({
    clientId: "outbox-processor",
    brokers: ["localhost:9092"]
});
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const consumer = kafka.consumer({ groupId: 'main-worker' });
        yield consumer.connect();
        yield consumer.subscribe({ topic: TOPIC_NAME, fromBeginning: true });
        yield consumer.run({
            autoCommit: false,
            eachMessage: (_a) => __awaiter(this, [_a], void 0, function* ({ topic, partition, message }) {
                var _b, _c;
                console.log({
                    value: (_b = message.value) === null || _b === void 0 ? void 0 : _b.toString(),
                    topic,
                    offset: message.offset,
                    timestamp: message.timestamp,
                    key: (_c = message.key) === null || _c === void 0 ? void 0 : _c.toString(),
                    headers: message.headers,
                    partition,
                });
                // send to the zap service
                yield new Promise(r => setTimeout(r, 1000));
            })
        });
    });
}
main();
