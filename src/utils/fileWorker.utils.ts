import cron from "node-cron";
import { prisma } from "$utils/prisma.utils";
import { FileStatus } from "@prisma/client";

async function runOnce() {
  const job = await prisma.fileProcess.findFirst({
    where: { status: FileStatus.PENDING },
    orderBy: { createdAt: "asc" },
  });

  if (!job) return;

  await prisma.fileProcess.update({
    where: { id: job.id },
    data: { status: FileStatus.IN_PROGRESS, attempts: { increment: 1 } },
  });

  // sementara: langsung sukses (nanti kita ganti jadi parse Excel + insert Product)
  await prisma.fileProcess.update({
    where: { id: job.id },
    data: { status: FileStatus.SUCCESS },
  });
}

export function startFileWorker() {
  cron.schedule("*/5 * * * * *", runOnce);
}