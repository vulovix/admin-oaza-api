import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import Config from "../config";
import DateHelper from "../helpers/date.helper";
import ResponseHelper from "../helpers/response.helper";
import AccountModel from "../models/account.model";

const { NotFound, Ok, EmailOccupied } = ResponseHelper;

const AccountController = {
  register: async (req, res): Promise<void> => {
    const obj = new AccountModel(req.value.body);
    const user = await AccountModel.findOne({ email: obj.email });
    if (user) {
      return res.status(403).send(EmailOccupied);
    }
    bcrypt.genSalt(8, (err, salt) => {
      bcrypt.hash(obj.password, salt, async (err, hash) => {
        obj.password = hash;
        obj.createdAt = new Date().getTime();
        obj.modifiedAt = new Date().getTime();
        obj.emailConfirmed = false;
        const user = await obj.save();
        const token = jwt.sign({ user: user._id }, Config.ACCOUNT_SECRET, { expiresIn: "12h" });
        const isSecureCookie = process.env.NODE_ENV === "production";
        res.cookie("Authorization", token, { expires: DateHelper.dateAdd(new Date(), "hour", 8), path: "/", sameSite: "Strict", httpOnly: isSecureCookie, secure: isSecureCookie });
        res.status(200).send(Ok);
      });
    });
  },
  logout: async (req, res): Promise<void> => {
    const isSecureCookie = process.env.NODE_ENV === "production";
    res.cookie("Authorization", "", { expires: DateHelper.dateAdd(new Date(), "hour", -8), path: "/", sameSite: "Strict", httpOnly: isSecureCookie, secure: isSecureCookie });
    res.status(200).send(Ok);
  },
  loginWithEmailAndPassword: async (req, res): Promise<void> => {
    if (!req.body.email || !req.body.password) {
      res.status(404).send(NotFound);
    }

    const user = await AccountModel.findOne({ email: req.body.email }); //.populate("role");
    if (user && user.emailConfirmed) {
      bcrypt.compare(req.body.password, user.password, async (err, success) => {
        if (success) {
          const token = jwt.sign({ user: user._id }, Config.ACCOUNT_SECRET, { expiresIn: "8h" });
          user.password = undefined;
          const isSecureCookie = process.env.NODE_ENV === "production";
          res.cookie("Authorization", token, {
            expires: DateHelper.dateAdd(new Date(), "hour", 8),
            path: "/",
            sameSite: "Strict",
            httpOnly: isSecureCookie,
            secure: isSecureCookie,
          });
          res.status(200).send(user);
        } else {
          try {
            res.status(404).send(NotFound);
          } catch (err) {
            res.status(404).send(NotFound);
          }
        }
      });
    } else {
      res.status(404).send(NotFound);
    }
  },
  getInfo: async (req, res): Promise<void> => {
    const user = await AccountModel.findOne({ _id: req.decoded.user }, { password: 0, emailConfirmed: 0 });
    if (user) {
      const token = jwt.sign({ user: user._id }, Config.ACCOUNT_SECRET, { expiresIn: "8h" });
      const isSecureCookie = process.env.NODE_ENV === "production";
      res.cookie("Authorization", token, { expires: DateHelper.dateAdd(new Date(), "hour", 8), path: "/", sameSite: "Strict", httpOnly: isSecureCookie, secure: isSecureCookie });
      res.status(200).send(user);
    } else {
      res.status(404).send(NotFound);
    }
  },
  update: async (req, res): Promise<void> => {
    const userId = req.decoded.user;
    const content = req.value.body;
    const existingUser = await AccountModel.findOne({ email: content.email });

    if (!existingUser || (existingUser && userId === existingUser._id.toString())) {
      content.modifiedAt = new Date().getTime();
      await AccountModel.findByIdAndUpdate(userId, content);
      const savedUser = await AccountModel.findOne({ _id: userId }, { password: 0, emailConfirmed: 0 });
      res.status(200).send(savedUser);
    } else {
      res.status(403).send(EmailOccupied);
    }
  },
};

export default AccountController;
