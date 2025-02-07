"use client";

import { OperationsModal } from "@/components/modals/operations";
import { TranscodeModal } from "@/components/modals/transcode.modal";
import { ConvertModal } from "../modals/convert.modal";
import { SubtitleModal } from "../modals/subtitle.modal";

export function ModalProvider() {
  return (
    <>
      <OperationsModal />
      <TranscodeModal />
      <ConvertModal />
      <SubtitleModal />
    </>
  );
}
