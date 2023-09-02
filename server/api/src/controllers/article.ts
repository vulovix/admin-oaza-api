import ArticleModel from "../models/article";
import CategoryModel from "../models/category";

const ExcludedArticleFields = { __v: 0, createdAt: 0, modifiedAt: 0, createdBy: 0, modifiedBy: 0 };
const ExcludedArticlePublicFields = { __v: 0, public: 0, modifiedAt: 0, createdBy: 0, modifiedBy: 0 };

const ArticleController = {
  publicGet: async (req, res): Promise<void> => {
    const result = await ArticleModel.find({ public: true }, { ...ExcludedArticlePublicFields, description: 0, image: 0 })
      .sort({
        createdAt: -1,
      })
      .populate({
        path: "categories",
        select: "slug name",
      });
    res.status(200).json(result);
  },
  publicGetById: async (req, res): Promise<void> => {
    const result = await ArticleModel.findOne({ slug: req.params.id }, ExcludedArticlePublicFields).populate({
      path: "categories",
      select: "slug name",
    });
    res.status(200).json(result);
  },
  publicGetImageById: async (req, res): Promise<void> => {
    const result = await ArticleModel.findOne({ slug: req.params.id }, { image: 1 });
    res.status(200).send(result?.image);
  },
  publicGetByCategoryId: async (req, res): Promise<void> => {
    const category = await CategoryModel.findOne({ slug: req.params.id });
    if (category) {
      const articles = await ArticleModel.find({ public: true }, ExcludedArticlePublicFields)
        .sort({
          createdAt: -1,
        })
        .populate({
          path: "categories",
          select: "slug name",
        });
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      res.status(200).json(articles.filter((a) => a.categories.some((c) => c.slug === category.slug)));
    }
    // res.status(200).json([]);
  },
  get: async (req, res): Promise<void> => {
    const result = await ArticleModel.find({}, { ...ExcludedArticleFields, description: 0, image: 0 })
      .sort({
        createdAt: -1,
      })
      .populate({
        path: "categories",
        select: "_id slug name",
      });
    res.status(200).json(result);
  },
  getById: async (req, res): Promise<void> => {
    const result = await ArticleModel.findOne({ _id: req.params.id }, ExcludedArticleFields).populate({
      path: "categories",
      select: "_id slug name",
    });
    res.status(200).json(result);
  },
  //   getCategoriesWithArticles: async (req, res) => {
  //     await ArticleModel.aggregate([
  //       {
  //         $group: {
  //           _id: "$category",
  //           articles: {
  //             $push: "$_id",
  //           },
  //         },
  //       },
  //       {
  //         $project: {
  //           category: "$_id",
  //           articles: 1,
  //           _id: 0,
  //         },
  //       },
  //       {
  //         $lookup: {
  //           from: "articles",
  //           localField: "category",
  //           foreignField: "_id",
  //           as: "docs",
  //         },
  //       },
  //     ]).exec(async (err, categories) => {
  //       if (err) throw err;
  //       fullCategories = [];
  //       let c;
  //       for (const category of categories) {
  //         c = await CategoryModel.findOne(category.category);
  //         c.numberOfArticles = category.articles.length;
  //         fullCategories.push(c);
  //       }
  //       res.status(200).send(fullCategories);
  //     });
  //   },
  create: async (req, res): Promise<void> => {
    const obj = new ArticleModel(req.value.body);
    const articleExists = await ArticleModel.findOne({ slug: obj.slug });
    if (articleExists) {
      return res.status(403).json({ error: "Article with such name already exists." });
    }
    obj.createdAt = Date.now();
    obj.modifiedAt = Date.now();
    obj.createdBy = req.decoded.user;
    obj.modifiedBy = req.decoded.user;
    const result = await obj.save();
    const createdObj = await ArticleModel.findById(result._id, ExcludedArticleFields).populate({
      path: "categories",
      select: "_id slug name",
    });
    res.status(200).json(createdObj);
  },
  getArticle: async (req, res): Promise<void> => {
    const { slug } = req.value.params;
    const result = await ArticleModel.findOne({ slug });
    res.status(200).json(result);
  },
  //   getArticleById: async (req, res) => {
  //     const { id } = req.value.params;
  //     const result = await CategoryModel.findOne({ categoryId: id });
  //     res.status(200).json(result);
  //   },
  update: async (req, res): Promise<void> => {
    const { id } = req.value.params;
    const obj = await ArticleModel.findById(id);
    if (!obj) return res.status(404).json({ message: "Article do not exist." });
    const data = req.value.body;
    await ArticleModel.findByIdAndUpdate(id, data);
    const savedObj = await ArticleModel.findById(id, ExcludedArticleFields).populate({
      path: "categories",
      select: "_id slug name",
    });
    res.status(200).json(savedObj);
  },
  remove: async (req, res): Promise<void> => {
    const { id } = req.value.params;
    const obj = await ArticleModel.findById(id);
    if (!obj) {
      return res.status(404).json({ message: "Article does not exist." });
    }
    await ArticleModel.findByIdAndRemove(id);
    res.status(200).json({
      _id: id,
    });
  },
};

export default ArticleController;
