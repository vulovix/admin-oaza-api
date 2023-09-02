import router from "express-promise-router";

import ArticleController from "../controllers/article";
import RouterHelper from "../helpers/route";
import tokenMiddleware from "../middlewares/token";
import ArticleValidator from "../validators/article";
import CommonValidator from "../validators/common";

const { create, update } = ArticleValidator;

const ArticleRoutes = router();

ArticleRoutes.route("/public").get([], ArticleController.publicGet);
ArticleRoutes.route("/public/:id").get([RouterHelper.validateParams(CommonValidator.slug, "id")], ArticleController.publicGetById);
ArticleRoutes.route("/public/images/:id").get([RouterHelper.validateParams(CommonValidator.slug, "id")], ArticleController.publicGetImageById);
ArticleRoutes.route("/public/categories/:id").get([RouterHelper.validateParams(CommonValidator.slug, "id")], ArticleController.publicGetByCategoryId);

ArticleRoutes.use(tokenMiddleware);

ArticleRoutes.route("/").get([], ArticleController.get);
ArticleRoutes.route("/").post([RouterHelper.validateBody(create)], ArticleController.create);
ArticleRoutes.route("/:id").get([RouterHelper.validateParams(CommonValidator.objectId, "id")], ArticleController.getById);
ArticleRoutes.route("/:id").patch([RouterHelper.validateParams(CommonValidator.objectId, "id"), RouterHelper.validateBody(update)], ArticleController.update);
ArticleRoutes.route("/:id").delete([RouterHelper.validateParams(CommonValidator.objectId, "id")], ArticleController.remove);

export default ArticleRoutes;
