"use client";
import { create } from "zustand";

export type ExtendedFile = {
  file: File;
  id: string;
  uploadPercentage: number;
  status: "uploading" | "success" | "error" | "idle";
};

export type TFileStore = {
  files: ExtendedFile[];
  appendFiles: (files: File[]) => void;
  deleteFile: (file: ExtendedFile | string) => void;
  uploadStatus: ({
    fileId,
    status,
  }: {
    fileId: string;
    status: ExtendedFile["status"];
  }) => void;
  clearFiles: () => void;
  changeUploadPercentage: ({
    fileId,
    percentage,
  }: {
    fileId: string;
    percentage: number;
  }) => void;
};

export const useUploadStore = create<TFileStore>()((set) => ({
  files: [],
  appendFiles: (files) => {
    set((state) => {
      const newFiles = files
        .filter(
          (newFile) =>
            !state.files.some((file) => file.id === newFile.name + newFile.size)
        )
        .map((file) => {
          return {
            file,
            id: file.name + file.size,
            status: "idle",
            uploadPercentage: 0,
          } satisfies ExtendedFile;
        });
      return {
        files: [...state.files, ...newFiles],
      };
    });
  },
  deleteFile: (file) => {
    if (typeof file === "string") {
      set((state) => ({
        files: state.files.filter((f) => f.id !== file),
      }));
      return;
    } else if (typeof file === "object") {
      set((state) => ({
        files: state.files.filter((f) => f.id !== file.id),
      }));
    }
  },
  uploadStatus: (file) => {
    set((state) => ({
      files: state.files.map((f) => {
        if (f.id === file.fileId) {
          return {
            ...f,
            status: file.status,
          };
        }
        return f;
      }),
    }));
  },
  clearFiles: () => {
    set({ files: [] });
  },
  changeUploadPercentage: ({ fileId, percentage }) => {
    set((state) => ({
      files: state.files.map((f) => {
        if (f.id === fileId) {
          return {
            ...f,
            uploadPercentage: percentage,
          };
        }
        return f;
      }),
    }));
  },
}));
