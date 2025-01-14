import { Router } from "express";
import { body } from "express-validator";
import * as projectController from "../controllers/project.controller.js";
import { authUser } from "../middleware/auth.middleware.js";
const router = Router();

router.post(
  "/create",
  authUser,
  body("name").isString().withMessage("Name is required"),
  projectController.createProject
);

router.get("/all", authUser, projectController.getAllProjects);


router.put(
  "/addUser",
  authUser,
  body("projectId").isString().withMessage("ProjectId is required"),
  body("users")
    .isArray({ min: 1 })
    .withMessage("Users must be an array").bail()
    .custom(
      (users) => (users) => users.every((user) => typeof user === "string")
    )
    .withMessage("Users must be an array of strings"),
  projectController.addUser
);

router.get('/get-project/:projectId', authUser, projectController.getProject);

export default router;
