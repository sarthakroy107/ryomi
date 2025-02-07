"use client";


import { create } from "zustand";
import {
  TConvertFormatOptions,
  TNLLB200LanguageCodes,
  TOperationSchema,
  TWhisperLanguageCodes,
  type TScalingOptions,
} from "@/lib/zod/operation-validator";
import { TUploadedFile } from "../zod/genral-purpose/base-schemas.zod";

//**Props */

export type SelectFiletoreProps = {
  //**File related */
  file: TUploadedFile | null;
  setFile: (file: TUploadedFile) => void;
  removeFile: () => void;

  //**Operations related*/
  transcode: TOperationSchema["transcode"] | null;
  convert: TOperationSchema["convert"] | null;
  subtitles: TOperationSchema["subtitles"];
  appendTranscode: ({
    format,
    scale,
  }: {
    scale: TScalingOptions;
    format: TConvertFormatOptions;
  }) => void;
  removeTranscode: ({
    format,
    scale,
  }: {
    scale: TScalingOptions;
    format: TConvertFormatOptions;
  }) => void;
  clearTranscode: () => void;

  appendConvert: (format: TConvertFormatOptions) => void;
  removeConvert: (format: TConvertFormatOptions) => void;
  clearConvert: () => void;

  setVideoLanguage: (language: TWhisperLanguageCodes | "auto") => void;
  removeVideoLanguage: () => void;

  appendSubtitleLang: (language: TNLLB200LanguageCodes) => void;
  removeSubtitleLang: (language: TNLLB200LanguageCodes) => void;
  clearSubtitleLang: () => void;

  clear: () => void;

  hasSomeOperation: () => boolean;
};

//**Store */

export const useOperationStore = create<SelectFiletoreProps>()((set, get) => ({
  file: null,
  setFile: (file) => set({ file }),
  removeFile: () => set({ file: null }),

  transcode: null,
  convert: null,
  subtitles: {
    videoLanguage: "auto",
    subtitleLanguages: [],
  },
  appendTranscode: ({ format, scale }) =>
    set((state) => {
      if (
        state.transcode?.find(
          (file) => file.format === format && file.scale === scale
        )
      ) {
        return state;
      }
      return state.transcode
        ? { transcode: [...state.transcode, { format, scale }] }
        : { transcode: [{ format, scale }] };
    }),
  removeTranscode: ({ format, scale }) =>
    set((state) => {
      return {
        transcode: state.transcode?.filter(
          (file) => file.format !== format && file.scale !== scale
        ),
      };
    }),
  clearTranscode: () => set({ transcode: null }),

  appendConvert: (format) =>
    set((state) => {
      if (state.convert?.find((file) => file === format)) {
        return state;
      }
      return state.convert
        ? { convert: [...state.convert, format] }
        : { convert: [format] };
    }),

  removeConvert: (format) =>
    set((state) => {
      return { convert: state.convert?.filter((file) => file !== format) };
    }),

  clearConvert: () => set({ convert: null }),

  setVideoLanguage: (language) =>
    set((state) => {
      return {
        subtitles: {
          videoLanguage: language,
          subtitleLanguages: state.subtitles.subtitleLanguages,
        },
      };
    }),

  removeVideoLanguage: () =>
    set((state) => {
      return {
        subtitles: {
          videoLanguage: "auto",
          subtitleLanguages: state.subtitles.subtitleLanguages,
        },
      };
    }),

  appendSubtitleLang: (language) => {
    set((state) => {
      if (state.subtitles.subtitleLanguages.includes(language)) {
        return state;
      }
      return {
        subtitles: {
          videoLanguage: state.subtitles.videoLanguage,
          subtitleLanguages: [...state.subtitles.subtitleLanguages, language],
        },
      };
    });
  },

  removeSubtitleLang: (language) => {
    set((state) => {
      return {
        subtitles: {
          videoLanguage: state.subtitles.videoLanguage,
          subtitleLanguages: state.subtitles.subtitleLanguages.filter(
            (lan) => lan !== language
          ),
        },
      };
    });
  },

  clearSubtitleLang: () => {
    set((state) => {
      return {
        subtitles: {
          videoLanguage: state.subtitles.videoLanguage,
          subtitleLanguages: [],
        },
      };
    });
  },

  clear: () => {
    set({
      file: null,
      transcode: null,
      convert: null,
      subtitles: { videoLanguage: "auto", subtitleLanguages: [] },
    });
  },
  hasSomeOperation: () => {
    const { file, transcode, convert, subtitles } = get();

    return !!file && !!(transcode || convert || subtitles);
  },
}));
