import { z } from "zod";
import OpenAI from "openai";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})


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
      } catch {
      }
    })
});
