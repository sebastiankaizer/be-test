import { prisma } from "$utils/prisma.utils";

export async function createJob(params: {
  userId: string;
  fileUrl: string;
  originalName?: string;
}) {
  return prisma.fileProcess.create({
    data: {
      userId: params.userId,
      sourceUrl: params.fileUrl,
      originalName: params.originalName ?? null,
      status: "PENDING",
    },
  });
}

export async function listJobs(params: {
  userId: string;
  page?: number;
  rows?: number;
}) {
  const page = params.page && params.page > 0 ? params.page : 1;
  const rows = params.rows && params.rows > 0 ? Math.min(params.rows, 100) : 10;

  const where = { userId: params.userId };

  const [data, total] = await prisma.$transaction([
    prisma.fileProcess.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * rows,
      take: rows,
    }),
    prisma.fileProcess.count({ where }),
  ]);

  return {
    data,
    meta: {
      page,
      rows,
      total,
      totalPages: Math.ceil(total / rows),
    },
  };
}

export async function getJobDetail(params: {
  userId: string;
  fileId: string;
}) {
  return prisma.fileProcess.findFirst({
    where: {
      id: params.fileId,
      userId: params.userId,
    },
  });
}

export async function retryJob(params: {
  userId: string;
  fileId: string;
}) {
  const job = await prisma.fileProcess.findFirst({
    where: {
      id: params.fileId,
      userId: params.userId,
    },
  });

  if (!job) {
    return { error: "Not Found" as const };
  }

  if (job.status !== "FAILED") {
    return { error: "Only FAILED job can be retried" as const };
  }

  const updated = await prisma.fileProcess.update({
    where: { id: params.fileId },
    data: {
      status: "PENDING",
      errorMessage: null,
    },
  });

  return { job: updated };
}