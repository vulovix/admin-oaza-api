import router from "express-promise-router";

import OpenAIController from "../controllers/openai";
import RouteHelper from "../helpers/route";
// import openAIMiddleware from "../middlewares/openai";
import tokenMiddleware from "../middlewares/token";
import OpenAIValidator from "../validators/openai";

const { validateBody } = RouteHelper;

const OpenAIRoutes = router();

// OpenAIRoutes.use(openAIMiddleware);
OpenAIRoutes.use(tokenMiddleware);

OpenAIRoutes.route("/").post([validateBody(OpenAIValidator.prompt)], OpenAIController.prompt);

OpenAIRoutes.route("/stream").post([validateBody(OpenAIValidator.prompt)], OpenAIController.streamPrompt);

export default OpenAIRoutes;
