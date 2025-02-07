import { ChevronRight } from "lucide-react";
import { Particles } from "./particles";
import * as motion from "motion/react-client";
import Link from "next/link";

export function Hero() {
  return (
    <div className="relative flex flex-col items-center">
      <Particles className="h-[85vh] absolute inset-0 -z-10" />
      <div className="max-w-full flex flex-col justify-center items-center h-[60vh] text-white/70 px-2">
        {/* <motion.p
          initial={{ y: 10 }}
          animate={{ y: 0 }}
          className="text-6xl w-fit font-extrabold bg-gradient-to-t from-white/90 to-white/70 bg-clip-text text-transparent"
        >
          Video processing doesn&apos;t
        </motion.p> */}
        <div className="flex gap-x-3">
          {row1.map((word, i) => (
            <motion.p
              key={i}
              initial={{ y: 10, opacity: 0 }}
              animate={{
                y: 0,
                opacity: 1,
                transition: { delay: word.delay * 1, ease: "easeOut" },
              }}
              className="text-[1.5rem] md:text-4xl lg:text-6xl w-fit font-extrabold bg-gradient-to-t from-white/90 to-white/70 bg-clip-text text-transparent"
            >
              {word.word}
            </motion.p>
          ))}
        </div>
        <div className="flex gap-x-3">
          {row2.map((word, i) => (
            <motion.p
              key={i}
              initial={{ y: 10, opacity: 0 }}
              animate={{
                y: 0,
                opacity: 1,
                transition: { delay: word.delay * 1 },
              }}
              className="text-[1.5rem] md:text-4xl lg:text-6xl w-fit font-extrabold bg-gradient-to-t from-white/90 to-white/70 bg-clip-text text-transparent"
            >
              {word.word}
            </motion.p>
          ))}
        </div>
        {/* <p className="text-6xl w-fit font-extrabold bg-gradient-to-t from-white/100 to-white/80 bg-clip-text text-transparent ">
          have to be hard
        </p> */}
        <motion.p
          initial={{ y: 10, opacity: 0 }}
          animate={{
            y: 0,
            opacity: 1,
            transition: { delay: 1, ease: "easeOut" },
          }}
          className="text-sm md:text-base lg:text-lg font-medium text-muted-foreground mt-5"
        >
          That&apos;s why{" "}
          <span className="text-white/80 font-medium">Ryomi</span> is here to
          help you
        </motion.p>
        <motion.button
          initial={{ y: 10, opacity: 0 }}
          animate={{
            y: 0,
            opacity: 1,
            transition: { delay: 1.4 },
          }}
          className="border-beam-card-wrapper mt-7 w-36 h-11"
        >
          <Link href={'/login'} className="border-beam-card-content">
            <div className="pl-6 group relative w-[100%] h-[100%] flex items-center justify-start text-muted-foreground hover:text-white/80">
              Get started{" "}
              <ChevronRight className="h-4 w-4 absolute right-3 top-3 group-hover:right-2.5 transition-all" />{" "}
            </div>
          </Link>
        </motion.button>
      </div>
    </div>
  );
}

const row1: { word: string; delay: number }[] = [
  { word: "Video", delay: 0 },
  { word: "proccessing", delay: 0.15 },
  { word: "doesn't", delay: 0.3 },
  // { word: "have", delay: 3000 },
  // { word: "to", delay: 4000 },
  // { word: "be", delay: 5000 },
  // { word: "hard", delay: 6000 },
];

const row2: { word: string; delay: number }[] = [
  // { word: "Video", delay: 0 },
  // { word: "proccessing", delay: 0.15 },
  // { word: "doesn't", delay: 0.3 },
  { word: "have", delay: 0.4 },
  { word: "to", delay: 0.5 },
  { word: "be", delay: 0.6 },
  { word: "hard", delay: 0.7 },
];
