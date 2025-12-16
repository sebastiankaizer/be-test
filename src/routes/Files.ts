import { Router } from "express";
import * as FileController from "$controllers/rest/FileController";
import { authMiddleware } from "$middlewares/authMiddleware";

const FilesRoutes = Router({ mergeParams: true });

FilesRoutes.post("/", authMiddleware, FileController.create);
FilesRoutes.get("/", authMiddleware, FileController.list);
FilesRoutes.get("/:id", authMiddleware, FileController.detail);
FilesRoutes.post("/:id/retry", authMiddleware, FileController.retry);

export default FilesRoutes;