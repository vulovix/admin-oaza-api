import { Configuration, OpenAIApi } from "openai";

import Config from "../config";
import stream from "../stream";

const { OPENAI_ORGANIZATION, OPENAI_API_KEY } = Config;

const OpenAIController = {
  prompt: async (req, res) => {
    const configuration = new Configuration({
      organization: OPENAI_ORGANIZATION,
      apiKey: OPENAI_API_KEY,
    });
    const OpenAI = new OpenAIApi(configuration);
    try {
      const response = await OpenAI.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: req.value.body.messages,
      });
      res.status(200).send(response.data.choices[0]);
    } catch (e) {
      res.status(200).send({});
    }
  },
  streamPrompt: async (req, res) => {
    const configuration = new Configuration({
      organization: OPENAI_ORGANIZATION,
      apiKey: OPENAI_API_KEY,
    });
    const OpenAI = new OpenAIApi(configuration);
    res.flush = () => undefined;
    try {
      const response = await OpenAI.createChatCompletion(
        {
          model: "gpt-3.5-turbo",
          messages: req.value.body.messages,
          stream: true,
        },
        { responseType: "stream" },
      );
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      response.data.on("data", (data) => {
        const lines = data
          .toString()
          .split("\n")
          .filter((line) => line.trim() !== "");
        for (const line of lines) {
          const message = line.replace(/^data: /, "");
          if (message === "[DONE]") {
            return; // Stream finished
          }
          try {
            const parsed = JSON.parse(message);
            const id = parsed.id;
            const role = "assistant";
            const content = parsed.choices[0].delta.content;

            if (content) {
              stream.send({ id, role, content }, req.value.body.deviceId);
            }
            if (parsed.choices[0].finish_reason === "stop") {
              res.end();
            }
          } catch (error) {
            console.log("error", error);
            // console.error("Could not JSON parse stream message", message, error);
          }
        }
      });
    } catch (error: any) {
      if (error.response && error.response.status) {
        console.error(error.response.status, error.message);
        error.response.data.on("data", (data) => {
          const message = data.toString();
          try {
            const parsed = JSON.parse(message);
            console.error("An error occurred during OpenAI request: ", parsed);
          } catch (error) {
            console.error("An error occurred during OpenAI request: ", message);
          }
        });
      } else {
        console.error("An error occurred during OpenAI request", error);
      }
    }
  },
};

export default OpenAIController;
