import ArticleModel from "../models/article";
import CategoryModel from "../models/category";

const ExcludedCategoryFields = { __v: 0, __id: 0, createdAt: 0, modifiedAt: 0, createdBy: 0, modifiedBy: 0 };

const CategoryController = {
  publicGet: async (req, res): Promise<void> => {
    const result = await CategoryModel.find({}, ExcludedCategoryFields);
    res.status(200).json(result);
  },
  get: async (req, res): Promise<void> => {
    const result = await CategoryModel.find({}, ExcludedCategoryFields);
    res.status(200).json(result);
  },
  getById: async (req, res): Promise<void> => {
    const result = await CategoryModel.findOne({ _id: req.params.id }, ExcludedCategoryFields);
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
    const obj = new CategoryModel(req.value.body);
    const categoryExists = await CategoryModel.findOne({ slug: obj.slug });
    if (categoryExists) {
      return res.status(403).json({ error: "Category with such name already exists." });
    }
    obj.createdAt = Date.now();
    obj.modifiedAt = Date.now();
    obj.createdBy = req.decoded.user;
    obj.modifiedBy = req.decoded.user;
    const result = await obj.save();
    const createdObj = await CategoryModel.findById(result._id, ExcludedCategoryFields);
    res.status(200).json(createdObj);
  },
  // getCategory: async (req, res): Promise<void> => {
  //   const { slug } = req.value.params;
  //   const result = await CategoryModel.findOne({ slug });
  //   res.status(200).json(result);
  // },
  //   getCategoryById: async (req, res) => {
  //     const { id } = req.value.params;
  //     const result = await CategoryModel.findOne({ categoryId: id });
  //     res.status(200).json(result);
  //   },
  update: async (req, res): Promise<void> => {
    const { id } = req.value.params;
    const obj = await CategoryModel.findOne({ _id: id });
    if (!obj) return res.status(404).json({ message: "Category do not exist." });
    const data = req.value.body;
    await CategoryModel.findByIdAndUpdate(id, data);
    const savedObj = await CategoryModel.findById(id, ExcludedCategoryFields);
    res.status(200).json(savedObj);
  },
  remove: async (req, res): Promise<void> => {
    const { id } = req.value.params;
    const obj = await CategoryModel.findById(id);
    if (!obj) {
      return res.status(404).json({ message: "Category does not exist." });
    }
    const articles = await ArticleModel.find({ category: id });
    if (articles && articles.length) {
      return res.status(403).json({ message: "This category is used in " + articles.length + " articles and can not be deleted." });
    }
    await CategoryModel.findByIdAndRemove(id);
    res.status(200).json({
      _id: id,
    });
  },
};

export default CategoryController;
