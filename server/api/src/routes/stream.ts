import router from "express-promise-router";

import sse from "../stream";

const StreamRoutes = router();

StreamRoutes.route("/").get([], (req, res) => {
  res.flush = () => undefined;
  return sse.init(req, res);
});

export default StreamRoutes;
