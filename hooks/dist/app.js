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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const app = (0, express_1.default)();
const client = new client_1.PrismaClient();
//password logic
app.post("/hook/catch/:userId/:zapId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.userId;
    const zapId = req.params.zapId;
    const body = req.body;
    //store in db a new trigger
    yield client.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        const run = yield tx.zapRun.create({
            data: {
                zapId: zapId,
                metadata: body
            }
        });
        yield tx.zapRunOutBox.create({
            data: {
                zapRunId: run.id,
            }
        });
    }));
    res.json({
        message: "webhook received"
    });
    //push it on to a queue (kafka/redis)
}));
app.listen(3000, () => {
    console.log('Server running on port 3000');
});
