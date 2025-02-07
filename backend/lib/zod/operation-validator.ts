import { z } from "zod";

export const scalingOptions = [
  "256:144",
  "426:240",
  "640:360",
  "854:480",
  "1280:720",
  "1920:1080",
  "2560:1440",
  "3840:2160",
  "7680:4320",
] as const;

export type TScalingOptions = (typeof scalingOptions)[number];

export const formatOptions = [
  "mp4",
  "avi",
  "mkv",
  "mov",
  "wmv",
  "flv",
  "webm",
  "m4v",
  "hevc",
  "h265",
] as const;

export type TConvertFormatOptions = (typeof formatOptions)[number];

export const languages = [
  "English",
  "Spanish",
  "French",
  "German",
  "Chinese (Mandarin)",
  "Russian",
  "Portuguese",
  "Italian",
  "Dutch",
  "Korean",
  "Japanese",
  "Arabic",
  "Hindi",
  "Turkish",
  "Polish",
  "Vietnamese",
  "Czech",
  "Ukrainian",
  "Indonesian",
  "Swedish",
  "Norwegian",
  "Finnish",
  "Danish",
  "Greek",
  "Hungarian",
  "Romanian",
  "Thai",
  "Hebrew",
  "Malay",
  "Bengali",
  "Tagalog",
  "Serbian",
  "Croatian",
  "Bulgarian",
  "Slovak",
  "Slovenian",
  "Lithuanian",
  "Latvian",
  "Estonian",
  "Filipino",
] as const;

export const nllb200LanguageCodes = [
  "eng_Latn",
  "spa_Latn",
  "fra_Latn",
  "deu_Latn",
  "zho_Hans",
  "zho_Hant",
  "rus_Cyrl",
  "por_Latn",
  "ita_Latn",
  "nld_Latn",
  "kor_Hang",
  "jpn_Jpan",
  "arb_Arab",
  "hin_Deva",
  "tur_Latn",
  "pol_Latn",
  "vie_Latn",
  "ces_Latn",
  "ukr_Cyrl",
  "ind_Latn",
  "swe_Latn",
  "nor_Latn",
  "fin_Latn",
  "dan_Latn",
  "ell_Grek",
  "hun_Latn",
  "ron_Latn",
  "tha_Thai",
  "heb_Hebr",
  "msa_Latn",
  "ben_Beng",
  "tgl_Latn",
  "srp_Cyrl",
  "hrv_Latn",
  "bul_Cyrl",
  "slk_Latn",
  "slv_Latn",
  "lit_Latn",
  "lav_Latn",
  "est_Latn",
  "fil_Latn",
  "amh_Ethi",
  "hau_Latn",
  "ibo_Latn",
  "yor_Latn",
  "sna_Latn",
  "som_Latn",
  "swh_Latn",
  "wol_Latn",
  "kin_Latn",
  "lug_Latn",
  "orm_Latn",
  "tsn_Latn",
  "tso_Latn",
  "xho_Latn",
  "zul_Latn",
  "cat_Latn",
  "glg_Latn",
  "eus_Latn",
  "nob_Latn",
  "prs_Arab",
  "pus_Arab",
  "uig_Arab",
  "uzb_Latn",
  "uzb_Cyrl",
  "tat_Cyrl",
  "mon_Cyrl",
  "azj_Latn",
  "kaz_Cyrl",
  "kir_Cyrl",
  "tgk_Cyrl",
  "mlt_Latn",
  "bos_Latn",
  "bak_Cyrl",
  "hye_Armn",
  "kat_Geor",
  "bel_Cyrl",
  "mkd_Cyrl",
  "mlg_Latn",
  "mya_Mymr",
  "khm_Khmr",
  "lao_Laoo",
  "sin_Sinh",
  "tam_Taml",
  "tel_Telu",
  "kan_Knda",
  "mal_Mlym",
  "mar_Deva",
  "guj_Gujr",
  "pan_Guru",
  "asm_Beng",
  "nep_Deva",
  "bod_Tibt",
  "dzo_Tibt",
  "mni_Beng",
] as const;

// Whisper-supported languages as a Set
export const whisperSupportedLanguages = [
  "en", // English
  "es", // Spanish
  "fr", // French
  "de", // German
  "zh", // Chinese (Mandarin)
  "ru", // Russian
  "pt", // Portuguese
  "it", // Italian
  "nl", // Dutch
  "ko", // Korean
  "ja", // Japanese
  "ar", // Arabic
  "hi", // Hindi
  "tr", // Turkish
  "pl", // Polish
  "vi", // Vietnamese
  "cs", // Czech
  "uk", // Ukrainian
  "id", // Indonesian
  "sv", // Swedish
  "no", // Norwegian
  "fi", // Finnish
  "da", // Danish
  "el", // Greek
  "hu", // Hungarian
  "ro", // Romanian
  "th", // Thai
  "he", // Hebrew
  "ms", // Malay
  "bn", // Bengali
  "tl", // Tagalog
  "sr", // Serbian
  "hr", // Croatian
  "bg", // Bulgarian
  "sk", // Slovak
  "sl", // Slovenian
  "lt", // Lithuanian
  "lv", // Latvian
  "et", // Estonian
  "fil", // Filipino
] as const;

export type TWhisperLanguages = (typeof whisperSupportedLanguages)[number];
export type TNllb200LanguageCodes = (typeof nllb200LanguageCodes)[number];

export type TSubtitleLanguages = (typeof languages)[number];
export type TVideoLanguage = TSubtitleLanguages | "auto";

export const operationsSchema = z.object({
  uploadTableId: z.string(),
  transcode: z.array(
    z.object({
      scale: z.enum(scalingOptions),
      format: z.enum(formatOptions),
    })
  ),
  convert: z.array(z.enum(formatOptions)),
  subtitles: z.object({
    videoLanguage: z
      .enum(whisperSupportedLanguages)
      .or(z.literal("auto"))
      .default("auto"),
    subtitleLanguages: z.array(z.enum(nllb200LanguageCodes)),
  }),
});


export type TOperationSchema = z.infer<typeof operationsSchema>;