import router from "express-promise-router";

import CategoryController from "../controllers/category";
import RouterHelper from "../helpers/route";
import tokenMiddleware from "../middlewares/token";
import CategoryValidator from "../validators/category";
import CommonValidator from "../validators/common";

const { create, update } = CategoryValidator;

const CategoryRoutes = router();

CategoryRoutes.route("/public").get([], CategoryController.publicGet);

CategoryRoutes.use(tokenMiddleware);

CategoryRoutes.route("/").get([], CategoryController.get);
CategoryRoutes.route("/").post([RouterHelper.validateBody(create)], CategoryController.create);
CategoryRoutes.route("/:id").get([RouterHelper.validateParams(CommonValidator.objectId, "id")], CategoryController.getById);
CategoryRoutes.route("/:id").patch([RouterHelper.validateParams(CommonValidator.objectId, "id"), RouterHelper.validateBody(update)], CategoryController.update);
CategoryRoutes.route("/:id").delete([RouterHelper.validateParams(CommonValidator.objectId, "id")], CategoryController.remove);

export default CategoryRoutes;
