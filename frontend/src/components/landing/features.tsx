import { Captions, Fan, LucideIcon, Wind } from "lucide-react";
import { GlowCard, GlowCardWrapper } from "../glow-card/glow-card";

export function Features() {
  return (
    <div className="lg:w-2/3 py-2 flex flex-col items-center">
      <h3 className="text-4xl font-bold text-transparent bg-gradient-to-t from-white/85 to-white/65 bg-clip-text mb-5">
        What is Ryomi
      </h3>
      <p className="text-muted-foreground text-sm text-center">
        Ryomi is a fast, affordable and efficient application to convert video
        codecs, resolutions and AI subtitle generator
      </p>
      <GlowCardWrapper className="w-[85%] md:min-w-[900px] lg:min-w-[1000px] grid grid-cols-1 items-center justify-center md:grid-cols-3 gap-4 md:gap-1 pt-6">
        {data.map((item, key) => (
          <GlowCard
            key={key}
            className="relative group h-64 text-justify w-fit md:w-80 overflow-hidden"
          >
            <item.icon size={48} className="text-muted-foreground" />
            <h4 className="text-xl font-bold mt-10">{item.title}</h4>
            <p className="mt-4 text-muted-foreground group-hover:text-white/80 text-sm transition-all">
              {item.description}
            </p>
          </GlowCard>
        ))}
      </GlowCardWrapper>
    </div>
  );
}

const data: {
  title: string;
  description: string;
  icon: LucideIcon;
}[] = [
  {
    title: "Transcode",
    description:
      "Convert resolution and format of your videos that suit your needs. 100+ combinations available",
    icon: Wind,
  },
  {
    title: "Convert",
    description:
      "Change encoding of your videos with one click. 15+ codecs available for conversion at ease",
    icon: Fan,
  },
  {
    title: "Subtitles",
    description:
      "AI generated subtitles in 150+ with 90% accuracy. Wide range of range source langugaes are supported",
    icon: Captions,
  },
];
