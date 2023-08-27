import Joi from "joi";

const CategoryValidator = {
  create: Joi.object().keys({
    slug: Joi.string().required(),
    name: Joi.string().required(),
  }),
  update: Joi.object().keys({
    slug: Joi.string().required(),
    name: Joi.string().required(),
  }),
};

export default CategoryValidator;
