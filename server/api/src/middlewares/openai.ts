import Config from "../config";

const { OPENAI_API_KEY, OPENAI_ORGANIZATION } = Config;

function openAIMiddleware(req, res, next) {
  req.headers["Authorization"] = `Bearer ${OPENAI_API_KEY}`;
  req.headers["OpenAI-Organization"] = OPENAI_ORGANIZATION;
  next();
}

export default openAIMiddleware;
