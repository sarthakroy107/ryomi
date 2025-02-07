"use client";

import { useOperationMutation } from "@/hooks/use-operations.hook";
import {
  nllb200Languages,
  whisperSupportedLanguagesArray,
} from "@/lib/data/languges";
import { cn } from "@/lib/utils";
import {
  codecsArray,
  scalingOptions,
  TConvertFormatOptions,
  TNLLB200LanguageCodes,
  TOperationSchema,
  TScalingOptions,
} from "@/lib/zod/operation-validator";
import { useOperationStore } from "@/lib/zustand/operation-store";
import { Banknote, ChevronRight, PlusCircle, Trash } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  convertColumnDef,
  subtitleColumnDef,
  transcodeColumnDef,
} from "./data-table/colum-defs/operations-colums";
import { DataTable } from "./data-table/data-table";
import { GenericPopover } from "./modals/popover";
import { H4Heading } from "./providers/h4-headings";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { useMutation } from "@tanstack/react-query";
import { reqHandler } from "@/lib/helpers/fetch.helper";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { MoonLoader, RotateLoader } from "react-spinners";

type TOperqationCategories = "transcode" | "convert" | "subtitle" | null;

const options: { name: string; category: TOperqationCategories }[] = [
  {
    name: "Transcode",
    category: "transcode",
  },
  {
    name: "Convert",
    category: "convert",
  },
  {
    name: "Subtitle",
    category: "subtitle",
  },
];

export function OperationOptions() {
  const [category, setCategory] = useState<TOperqationCategories>("transcode");
  const { file, hasSomeOperation, transcode, convert, subtitles } =
    useOperationStore();
  const { mutate: operationMutation, isPending: operationIsPending } =
    useOperationMutation();

  const {
    data: creditData,
    isPending: creditIsPening,
    mutate: creditMution,
    error,
    isError,
  } = useMutation({
    mutationFn: async (body: TOperationSchema) => {
      if (!body) throw new Error("Data not found");
      return await reqHandler({
        method: "post",
        path: "/credit/calculator",
        body,
        resValidator: z.object({
          message: z.string().nullable(),
          creditsNeeded: z.number(),
        }),
      });
    },
  });

  const className =
    "dark:bg-white/5 border-x border-t dark:border-gray-300/10 rounded-t-[3px] transition border-b dark:border-b-black/50";

  const startMuation = () => {
    if (!hasSomeOperation()) return;
    if (!file) return toast.error("Please select a file to perform operations");
    operationMutation({
      uploadTableId: file.id,
      convert: convert || [],
      subtitles: subtitles || { videoLanguage: "auto", subtitleLanguages: [] },
      transcode: transcode || [],
    });
  };

  if (!file) {
    return null;
  }

  return (
    <div className="w-full min-h-2 border dark:border-white/10 rounded-sm p-1.5">
      <div className="flex justify-between w-full items-center">
        <H4Heading>Perform operations</H4Heading>
        <Dialog>
          <DialogTrigger asChild className="">
            <Button
              onClick={() => {
                creditMution({
                  convert: convert || [],
                  subtitles: subtitles || {
                    videoLanguage: "auto",
                    subtitleLanguages: [],
                  },
                  transcode: transcode || [],
                  uploadTableId: file.id,
                });
              }}
              disabled={
                !file ||
                ((!transcode || transcode.length === 0) &&
                  (!convert || convert.length === 0) &&
                  (!subtitles || subtitles.subtitleLanguages.length === 0))
              }
              variant="default"
              className="group rounded-full h-8"
            >
              Check credit amount
              <ChevronRight className="relative px-0 right-0 group-hover:-right-1 transition-all" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>Credits needed for operation</DialogTitle>
            <div className="w-full flex justify-center p-5">
              <ViewCreditsNeeded
                error={isError ? error?.message : null}
                data={creditIsPening || !creditData ? null : creditData}
              />
            </div>
            <DialogFooter className="w-full flex-col items-center sm:justify-between gap-1">
              <p className="text-xs font-medium text-rose-400/90 items-center">
                You don &apos; t have enough credits to perform this
              </p>
              <Button
                onClick={startMuation}
                disabled={
                  !file ||
                  ((!transcode || transcode.length === 0) &&
                    (!convert || convert.length === 0) &&
                    (!subtitles || subtitles.subtitleLanguages.length === 0)) ||
                  creditIsPening ||
                  operationIsPending
                }
                variant="default"
                className="group rounded-full h-8 space-x-1 w-24"
              >
                Start
                {operationIsPending ? (
                  <MoonLoader color="#000" size={15} />
                ) : (
                  <ChevronRight className="relative px-0 right-0 group-hover:-right-1 transition-all" />
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <Separator orientation="horizontal" />
      <div className="rounded-sm text-white/60 font-medium mt-2 px-3 relative top-[1px]">
        {options.map((option, i) => (
          <button
            key={i}
            className={cn(
              "px-1.5 py-1 border border-transparent",
              category === option.category && className
            )}
            onClick={() => setCategory(option.category)}
          >
            {option.name}
          </button>
        ))}
      </div>
      <div className="w-full dark:bg-white/5 rounded-[3px] border dark:border-white/10 p-2.5">
        {category === "transcode" && <TranscodeOperation />}
        {category === "convert" && <ConvertOperation />}
        {category === "subtitle" && <SubtitleOperation />}
      </div>
    </div>
  );
}

export function TranscodeOperation() {
  const { file, transcode, appendTranscode, clearTranscode } =
    useOperationStore();
  const [codec, setCodec] = useState<null | TConvertFormatOptions>(
    codecsArray.includes(file?.s3Key.split(".").pop() as TConvertFormatOptions)
      ? (file?.s3Key.split(".").pop() as TConvertFormatOptions)
      : null
  );
  const [scale, setScale] = useState<null | TScalingOptions>(null);
  return (
    <div>
      <div className="flex justify-between mb-2 overflow-x-auto">
        <GenericPopover
          currentVal={scale}
          setVal={(val) => {
            setScale(val);
          }}
          title="Select codec"
          data={scalingOptions.map((codec) => {
            return {
              name: codec.split(":").pop() as string,
              value: codec,
            };
          })}
          initialOpen={false}
        />

        <GenericPopover
          currentVal={codec}
          setVal={(val) => {
            setCodec(val);
          }}
          title="Select scale"
          data={codecsArray.map((scale) => {
            return {
              name: `${scale}`,
              value: scale,
            };
          })}
          initialOpen={false}
        />

        <ActionButtons
          addAction={() => {
            if (codec && scale) {
              appendTranscode({ format: codec, scale });
              setCodec(
                codecsArray.includes(
                  file?.s3Key.split(".").pop() as TConvertFormatOptions
                )
                  ? (file?.s3Key.split(".").pop() as TConvertFormatOptions)
                  : null
              );
              setScale(null);
            }
          }}
          clearAction={clearTranscode}
        />
      </div>
      {transcode && transcode.length > 0 && (
        <DataTable columns={transcodeColumnDef} data={transcode} />
      )}
    </div>
  );
}

export function ConvertOperation() {
  const { convert, appendConvert, clearConvert } = useOperationStore();
  const [codec, setCodec] = useState<null | TConvertFormatOptions>(null);
  return (
    <div>
      <div className="flex items-center mb-2">
        <GenericPopover
          currentVal={codec}
          setVal={(val) => {
            setCodec(val);
          }}
          title="Select format"
          data={codecsArray.map((codec) => {
            return {
              name: `.${codec}`,
              value: codec,
            };
          })}
          initialOpen={false}
        />
        <ActionButtons
          addAction={() => {
            if (!codec) return;
            appendConvert(codec);
            setCodec(null);
          }}
          clearAction={clearConvert}
        />
      </div>
      {convert && convert.length > 0 && (
        <DataTable
          columns={convertColumnDef}
          data={convert.map((type) => {
            return {
              format: type,
            };
          })}
        />
      )}
    </div>
  );
}

export function SubtitleOperation() {
  const { subtitles, setVideoLanguage, appendSubtitleLang, clearSubtitleLang } =
    useOperationStore();
  const [subtitleLanguages, setSubtitleLanguages] =
    useState<null | TNLLB200LanguageCodes>(null);
  return (
    <div className="">
      <div className="flex justify-between h-28">
        <div>
          <H4Heading className="text-sm">Video language</H4Heading>
          <GenericPopover
            currentVal={subtitles?.videoLanguage}
            setVal={(val) => {
              if (!subtitles) return;
              setVideoLanguage(val);
            }}
            title="Select language"
            data={whisperSupportedLanguagesArray.map((language) => {
              return {
                name: language.name,
                value: language.code,
              };
            })}
            initialOpen={false}
          />
        </div>
        <Separator className="h-full" orientation="vertical" />
        <div>
          <H4Heading className="text-sm">Subtitle languages</H4Heading>
          <div className="flex gap-x-1">
            <GenericPopover
              currentVal={subtitleLanguages}
              setVal={(val) => {
                setSubtitleLanguages(val);
              }}
              title="Select language"
              data={nllb200Languages.map((language) => {
                return {
                  name: language.name,
                  value: language.code,
                };
              })}
              initialOpen={false}
            />
            <ActionButtons
              addAction={() => {
                if (subtitleLanguages) {
                  appendSubtitleLang(subtitleLanguages);
                  setSubtitleLanguages(null);
                }
              }}
              clearAction={clearSubtitleLang}
            />
          </div>
        </div>
      </div>
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
    </div>
  );
}

function ActionButtons({
  addAction,
  clearAction,
  addDisabled,
  clearDisabled,
}: {
  addDisabled?: () => boolean | boolean;
  clearDisabled?: () => boolean | boolean;
  addAction: () => void;
  clearAction?: () => void;
}) {
  return (
    <div className="w-full flex justify-end gap-x-2 mb-2.5 mt-0.5">
      <Button
        onClick={addAction}
        variant="default"
        className="rounded-full h-8"
      >
        <PlusCircle />
        Add
      </Button>
      <Button
        onClick={clearAction}
        variant="outline"
        className="rounded-full h-8"
      >
        <Trash />
        Clear
      </Button>
    </div>
  );
}

function ViewCreditsNeeded({
  error,
  data,
}: {
  error: null | string;
  data: null | { creditsNeeded: number };
}) {
  if (error)
    return (
      <p className="md:text-lg font-medium dark:text-white">Error: {error}</p>
    );

  if (!data) {
    return <RotateLoader color="#fff" size={12} />;
  }

  return (
    <div className="flex text-yellow-400 text-lg md:text-xl lg:text-4xl items-center gap-x-2">
      <Banknote size={35} /> {data.creditsNeeded}
    </div>
  );
}
