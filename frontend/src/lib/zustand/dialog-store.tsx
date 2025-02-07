"use cleint";

import { create } from "zustand";

export type TModal =
  | "select-uploaded-file"
  | "transcode-modal"
  | "convert-modal"
  | "subtitles-modal"
  | "credits-needed-for-operation-modal"
  | null;

export type TDialogs = {
  open: boolean;
  setOpen: ({ isOpen, type }: { type: TModal; isOpen: boolean }) => void;
  type: TModal;
  setClose: () => void;
  setClear: () => void;
};

export const useModalStore = create<TDialogs>((set) => ({
  open: false,
  setOpen: ({ isOpen, type }: { type: TModal; isOpen: boolean }) =>
    set({ open: isOpen, type }),
  type: null,
  setClose: () => set({ type: null, open: false }),
  setClear: () => set({ open: false }),
}));
