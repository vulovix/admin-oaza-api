import Joi from "joi";

const OpenAIValidator = {
  urlIdentificator: Joi.object().keys({
    id: Joi.string().required(),
  }),
  prompt: Joi.object({
    messages: Joi.array().required(),
    deviceId: Joi.string().required(),
  }),
};

export default OpenAIValidator;
