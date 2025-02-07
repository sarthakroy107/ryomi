import { z } from "zod";

export const FileTaskSchema = z.object({
  id: z.string(),
  uploadTableId: z.string(),
  userId: z.string(),
  type: z.enum(["transcode", "subtitle", "conversion"]),
  s3_key: z.string(),
  size: z.number().int().nonnegative().nullable(),
  status: z.enum(["complete", "in-progress", "failed"]).optional(),
  saveTill: z.string(),
  createdAt: z.string(),
});

export type TFileTaskOperations = z.infer<typeof FileTaskSchema>;

export const UploadFileSchema = z.object({
  id: z.string(),
  userId: z.string(),
  fileName: z.string().nullable().optional(),
  s3Key: z.string(),
  saveTill: z.string(),
  status: z.enum(["not-uploaded", "uploaded", "deleted", "error"]),
  size: z.number().int().nonnegative(),
  createdAt: z.string(),
});

export type TUploadedFile = z.infer<typeof UploadFileSchema>;

export const UploadedFilesArrayShema = z.array(UploadFileSchema);

export type TUploadedFiles = z.infer<typeof UploadedFilesArrayShema>;

export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string(),
  phoneNum: z.string().nullable().optional(),
  displayPic: z.string().optional(),
  region: z.string().nullable().optional(),
  campaign: z.string().nullable().optional(),
  referred_by: z.string().nullable().optional(),
  emailVerified: z.boolean(),
  registered2FA: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type TUser = z.infer<typeof UserSchema>;

export const paymentSchema = z.object({
  id: z.string(),
  userId: z.string(),
  pgRefId: z.string(),
  currency: z.enum(["inr"]),
  amount: z.number().int(),
  status: z.enum(["success", "failed", "pending"]),
  type: z.enum(["credit", "refund", "debit"]),
  method: z.string().nullable(),
  createdAt: z.string().datetime({ offset: true }),
  updatedAt: z.string().datetime({ offset: true }),
});

export type TPayment = z.infer<typeof paymentSchema>;

export const DownloadSchema = z.array(
  z.object({
    url: z.string(),
    name: z.string(),
  })
);

export type TDownload = z.infer<typeof DownloadSchema>;
