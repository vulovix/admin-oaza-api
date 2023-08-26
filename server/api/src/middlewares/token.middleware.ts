import jwt from "jsonwebtoken";

import Config from "../config";
import ResponseHelper from "../helpers/response.helper";

function tokenMiddleware(req, res, next): void {
  const token = req.cookies["Authorization"];
  if (!token) {
    res.status(403).send(ResponseHelper.Unauthorized);
  } else {
    jwt.verify(token, Config.ACCOUNT_SECRET, (err, decoded) => {
      if (err) {
        res.status(403).send(ResponseHelper.Unauthorized);
      } else {
        req.decoded = decoded;
        next();
      }
    });
  }
}

export default tokenMiddleware;
