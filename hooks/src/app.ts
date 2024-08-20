import express from 'express';
import { PrismaClient } from '@prisma/client';
const app = express();
const client = new PrismaClient()
//password logic
app.post("/hook/catch/:userId/:zapId", async (req, res) => {
    const userId = req.params.userId;
    const zapId = req.params.zapId;
    const body = req.body;
    //store in db a new trigger
    await client.$transaction(async tx => {
        const run = await tx.zapRun.create({
            data: {
                zapId: zapId,
                metadata: body
            }
        });
        await tx.zapRunOutBox.create({
            data: {
                zapRunId: run.id,
            }
        })
    })
    res.json({
        message: "webhook received"
    })

    //push it on to a queue (kafka/redis)


})

app.listen(3000, () => {
  console.log('Server running on port 3000');
});