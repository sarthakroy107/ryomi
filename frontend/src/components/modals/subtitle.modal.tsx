"use client";

import { useOperationStore } from "@/lib/zustand/operation-store";
import { Modal } from "./modal";
import { TWhisperLanguageCodes } from "@/lib/zod/operation-validator";
import { useState } from "react";
import { toast } from "sonner";
import { DataTable } from "../data-table/data-table";
import { subtitleColumnDef } from "../data-table/colum-defs/operations-colums";
import { whisperSupportedLanguagesArray } from "@/lib/data/languges";
import { GenericPopover } from "./popover";

export function SubtitleModal() {
  const { subtitles } = useOperationStore();
  return (
    <Modal title="Format convert options" type={"subtitles-modal"}>
      <SubtitleOptions />
      {subtitles && subtitles.subtitleLanguages.length > 0 && (
        <DataTable
          columns={subtitleColumnDef}
          data={subtitles.subtitleLanguages.map((lan) => {
            return {
              language: lan,
            };
          })}
        />
      )}
    </Modal>
  );
}

export function SubtitleOptions() {
  const { setVideoLanguage} = useOperationStore();
  const [openPop, setPop] = useState(false);
  const [lan, setLan] = useState<TWhisperLanguageCodes | null>();

  return (
    <div className="flex justify-between">
      <GenericPopover<TWhisperLanguageCodes | undefined | null>
        currentVal={lan}
        setVal={setLan}
        title="Select language"
        data={whisperSupportedLanguagesArray.map((language) => {
          return {
            name: language.name,
            value: language.code,
          };
        })}
        initialOpen={openPop}
      />
    </div>
  );
}
