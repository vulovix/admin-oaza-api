import Joi from "joi";

const ArticleSchema = {
  create: Joi.object().keys({
    public: Joi.boolean(),
    slug: Joi.string().required(),
    image: Joi.string().required(),
    title: Joi.string().required(),
    subtitle: Joi.string().required(),
    description: Joi.string().required().allow(null),
    categories: Joi.array()
      .items(Joi.string().regex(/^[0-9a-fA-F]{24}$/))
      .required(),
  }),
  update: Joi.object().keys({
    public: Joi.boolean().required(),
    slug: Joi.string().required(),
    image: Joi.string().required(),
    title: Joi.string().required(),
    subtitle: Joi.string().required(),
    description: Joi.string().required().allow(null),
    categories: Joi.array()
      .items(Joi.string().regex(/^[0-9a-fA-F]{24}$/))
      .required(),
  }),
};

export default ArticleSchema;
