import { createDeepSeek } from "@ai-sdk/deepseek";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText } from "ai";
import { inngest } from "./client";
const google = createGoogleGenerativeAI()
const deepseek = createDeepSeek()

export const execute = inngest.createFunction(
  { id: "execute-ai" },
  { event: "execute/deepseek" },
  async ({ event, step }) => {
    const { steps } = await step.ai.wrap(
      "deepseek-generate-text",
      generateText,
      {
        model: deepseek("deepseek-chat"),
        system: "You are a helpful assistant.",
        prompt: "what is 2 + 2?",
        experimental_telemetry: {
          isEnabled: true,
          recordInputs: true,
          recordOutputs: true,
        },
      }
    );
    return steps;
  },
);
