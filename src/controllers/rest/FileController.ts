import { Response } from "express";
import { response_success } from "$utils/response.utils";
import * as FileService from "$services/FileService";
import { AuthedRequest } from "$middlewares/authMiddleware";

export async function create(req: AuthedRequest, res: Response): Promise<Response> {
  const { fileUrl, originalName } = req.body as { fileUrl?: string; originalName?: string };

  if (!fileUrl) {
    return res.status(400).json({
      status: false,
      message: "fileUrl is required",
      errors: [],
    });
  }

  const job = await FileService.createJob({
    userId: req.user!.userId,
    fileUrl,
    originalName,
  });

  return response_success(res, { fileId: job.id, status: job.status }, "Success");
}

export async function list(req: AuthedRequest, res: Response): Promise<Response> {
  const page = req.query.page ? Number(req.query.page) : undefined;
  const rows = req.query.rows ? Number(req.query.rows) : undefined;

  const result = await FileService.listJobs({
    userId: req.user!.userId,
    page,
    rows,
  });

  return response_success(res, result, "Success");
}

export async function detail(req: AuthedRequest, res: Response): Promise<Response> {
  const fileId = req.params.id;

  const job = await FileService.getJobDetail({
    userId: req.user!.userId,
    fileId,
  });

  if (!job) {
    return res.status(404).json({
      status: false,
      message: "Not Found",
      errors: [],
    });
  }

  return response_success(res, job, "Success");
}

export async function retry(req: AuthedRequest, res: Response): Promise<Response> {
  const fileId = req.params.id;

  const result = await FileService.retryJob({
    userId: req.user!.userId,
    fileId,
  });

  if ("error" in result) {
    return res.status(400).json({
      status: false,
      message: result.error,
      errors: [],
    });
  }

  return response_success(res, { fileId: result.job.id, status: result.job.status }, "Success");
}
