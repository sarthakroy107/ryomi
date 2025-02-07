import {
  TNLLB200LanguageCodes,
  TWhisperLanguageCodes,
} from "@/lib/zod/operation-validator";

export const whisperSupportedLanguagesArray: {
  name: string;
  code: TWhisperLanguageCodes;
}[] = [
  { code: "auto", name: "Auto" },
  { code: "en", name: "English" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "zh", name: "Chinese (Mandarin)" },
  { code: "ru", name: "Russian" },
  { code: "pt", name: "Portuguese" },
  { code: "it", name: "Italian" },
  { code: "nl", name: "Dutch" },
  { code: "ko", name: "Korean" },
  { code: "ja", name: "Japanese" },
  { code: "ar", name: "Arabic" },
  { code: "hi", name: "Hindi" },
  { code: "tr", name: "Turkish" },
  { code: "pl", name: "Polish" },
  { code: "vi", name: "Vietnamese" },
  { code: "cs", name: "Czech" },
  { code: "uk", name: "Ukrainian" },
  { code: "id", name: "Indonesian" },
  { code: "sv", name: "Swedish" },
  { code: "no", name: "Norwegian" },
  { code: "fi", name: "Finnish" },
  { code: "da", name: "Danish" },
  { code: "el", name: "Greek" },
  { code: "hu", name: "Hungarian" },
  { code: "ro", name: "Romanian" },
  { code: "th", name: "Thai" },
  { code: "he", name: "Hebrew" },
  { code: "ms", name: "Malay" },
  { code: "bn", name: "Bengali" },
  { code: "tl", name: "Tagalog" },
  { code: "sr", name: "Serbian" },
  { code: "hr", name: "Croatian" },
  { code: "bg", name: "Bulgarian" },
  { code: "sk", name: "Slovak" },
  { code: "sl", name: "Slovenian" },
  { code: "lt", name: "Lithuanian" },
  { code: "lv", name: "Latvian" },
  { code: "et", name: "Estonian" },
  { code: "fil", name: "Filipino" },
];

export const nllb200Languages: {
  name: string;
  code: TNLLB200LanguageCodes;
}[] = [
  { code: "eng_Latn", name: "English" },
  { code: "spa_Latn", name: "Spanish" },
  { code: "fra_Latn", name: "French" },
  { code: "deu_Latn", name: "German" },
  { code: "zho_Hans", name: "Chinese (Simplified)" },
  { code: "zho_Hant", name: "Chinese (Traditional)" },
  { code: "rus_Cyrl", name: "Russian" },
  { code: "por_Latn", name: "Portuguese" },
  { code: "ita_Latn", name: "Italian" },
  { code: "nld_Latn", name: "Dutch" },
  { code: "kor_Hang", name: "Korean" },
  { code: "jpn_Jpan", name: "Japanese" },
  { code: "arb_Arab", name: "Arabic" },
  { code: "hin_Deva", name: "Hindi" },
  { code: "tur_Latn", name: "Turkish" },
  { code: "pol_Latn", name: "Polish" },
  { code: "vie_Latn", name: "Vietnamese" },
  { code: "ces_Latn", name: "Czech" },
  { code: "ukr_Cyrl", name: "Ukrainian" },
  { code: "ind_Latn", name: "Indonesian" },
  { code: "swe_Latn", name: "Swedish" },
  { code: "nor_Latn", name: "Norwegian" },
  { code: "fin_Latn", name: "Finnish" },
  { code: "dan_Latn", name: "Danish" },
  { code: "ell_Grek", name: "Greek" },
  { code: "hun_Latn", name: "Hungarian" },
  { code: "ron_Latn", name: "Romanian" },
  { code: "tha_Thai", name: "Thai" },
  { code: "heb_Hebr", name: "Hebrew" },
  { code: "msa_Latn", name: "Malay" },
  { code: "ben_Beng", name: "Bengali" },
  { code: "tgl_Latn", name: "Tagalog" },
  { code: "srp_Cyrl", name: "Serbian" },
  { code: "hrv_Latn", name: "Croatian" },
  { code: "bul_Cyrl", name: "Bulgarian" },
  { code: "slk_Latn", name: "Slovak" },
  { code: "slv_Latn", name: "Slovenian" },
  { code: "lit_Latn", name: "Lithuanian" },
  { code: "lav_Latn", name: "Latvian" },
  { code: "est_Latn", name: "Estonian" },
  { code: "fil_Latn", name: "Filipino" },
  { code: "amh_Ethi", name: "Amharic" },
  { code: "hau_Latn", name: "Hausa" },
  { code: "ibo_Latn", name: "Igbo" },
  { code: "yor_Latn", name: "Yoruba" },
  { code: "sna_Latn", name: "Shona" },
  { code: "som_Latn", name: "Somali" },
  { code: "swh_Latn", name: "Swahili" },
  { code: "wol_Latn", name: "Wolof" },
  { code: "kin_Latn", name: "Kinyarwanda" },
  { code: "lug_Latn", name: "Luganda" },
  { code: "orm_Latn", name: "Oromo" },
  { code: "tsn_Latn", name: "Tswana" },
  { code: "tso_Latn", name: "Tsonga" },
  { code: "xho_Latn", name: "Xhosa" },
  { code: "zul_Latn", name: "Zulu" },
  { code: "cat_Latn", name: "Catalan" },
  { code: "glg_Latn", name: "Galician" },
  { code: "eus_Latn", name: "Basque" },
  { code: "nob_Latn", name: "Norwegian Bokmål" },
  { code: "prs_Arab", name: "Dari" },
  { code: "pus_Arab", name: "Pashto" },
  { code: "uig_Arab", name: "Uyghur" },
  { code: "uzb_Latn", name: "Uzbek" },
  { code: "uzb_Cyrl", name: "Uzbek (Cyrillic)" },
  { code: "tat_Cyrl", name: "Tatar" },
  { code: "mon_Cyrl", name: "Mongolian" },
  { code: "azj_Latn", name: "Azerbaijani" },
  { code: "kaz_Cyrl", name: "Kazakh" },
  { code: "kir_Cyrl", name: "Kyrgyz" },
  { code: "tgk_Cyrl", name: "Tajik" },
  { code: "mlt_Latn", name: "Maltese" },
  { code: "bos_Latn", name: "Bosnian" },
  { code: "bak_Cyrl", name: "Bashkir" },
  { code: "hye_Armn", name: "Armenian" },
  { code: "kat_Geor", name: "Georgian" },
  { code: "bel_Cyrl", name: "Belarusian" },
  { code: "mkd_Cyrl", name: "Macedonian" },
  { code: "mlg_Latn", name: "Malagasy" },
  { code: "mya_Mymr", name: "Burmese" },
  { code: "khm_Khmr", name: "Khmer" },
  { code: "lao_Laoo", name: "Lao" },
  { code: "sin_Sinh", name: "Sinhala" },
  { code: "tam_Taml", name: "Tamil" },
  { code: "tel_Telu", name: "Telugu" },
  { code: "kan_Knda", name: "Kannada" },
  { code: "mal_Mlym", name: "Malayalam" },
  { code: "mar_Deva", name: "Marathi" },
  { code: "guj_Gujr", name: "Gujarati" },
  { code: "pan_Guru", name: "Punjabi" },
  { code: "asm_Beng", name: "Assamese" },
  { code: "nep_Deva", name: "Nepali" },
  { code: "bod_Tibt", name: "Tibetan" },
  { code: "dzo_Tibt", name: "Dzongkha" },
  { code: "mni_Beng", name: "Manipuri" },
];
