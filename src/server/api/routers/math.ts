import { z } from "zod";
import OpenAI from "openai";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY

})
const mathTutor = await openai.beta.assistants.create({
  name: "Math Tutor",
  instructions: "You are a personal math tutor. Write and run code to answer math questions.",
  tools: [{ type: "code_interpreter" }],
  model: "gpt-4o"
});

export const mathRouter = createTRPCRouter({
  extractMathExpr: publicProcedure
    .input(z.object({ base64Image: z.string() }))
    .mutation(async ({ input }) => {
      try {
        const response = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: "Please scan this image and process the extracted for mathematical expression in asciimath format, dont output steps on how to solve the problem, I need just the mathematical expression"
                },
                {
                  type: "image_url",
                  image_url: {
                    "url": `data:image/jpeg;base64,${input.base64Image}`
                  }
                },
              ]
            }
          ],
        })
        return response.choices[0]?.message.content
      } catch (error) {
        console.error("Error:", error)
      }
    }),
  solveEquation: publicProcedure
    .input(z.object({ mathEquation: z.string() }))
    .mutation(async ({ input }) => {
      try {
        const thread = await openai.beta.threads.create();
        await openai.beta.threads.messages.create(
          thread.id,
          {
            role: "user",
            content: `I need to solve the equation ${input.mathEquation}. Can you help me by breaking problem step by step?`
          }
        );
        let run = await openai.beta.threads.runs.createAndPoll(
          thread.id,
          {
            assistant_id: mathTutor.id,
            instructions: "Please address the user as Jane Doe. The user has a premium account."
          }
        );
        if (run.status === 'completed') {
          const messages = await openai.beta.threads.messages.list(
            run.thread_id
          );
          console.log("Messages", messages)
          return messages
        } else {
          console.log(run.status);
        }
      } catch {

      }
    })
});
