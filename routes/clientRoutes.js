import express from "express";
import {
  registerClient,
  loginClient,
  logoutClient,
} from "../controllers/clientController.js";

const clientRouter = express.Router();
clientRouter.post("/register", registerClient);
clientRouter.post("/login", loginClient);
clientRouter.post("/logout", logoutClient);
export default clientRouter;
