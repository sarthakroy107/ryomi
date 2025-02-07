import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export function Reviews() {
  return (
    <div className="w-full px-2 md:w-4/5 lg:w-2/3 flex flex-col gap-y-3 items-center">
      <h3 className="text-4xl font-bold text-transparent bg-gradient-to-t from-white/85 to-white/65 bg-clip-text mb-5 text-center px-4">
        What people say about Ryomi
      </h3>
      <div className="w-full flex justify-center">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-5 pt-6">
          {data.map((item, key) => (
            <Card key={key} className="w-80 md:h-[23vh] rounded-[4px]">
              <CardHeader className="flex flex-row items-center gap-x-4">
                <div>
                  <Image
                    src={item.pp}
                    alt="profile picture"
                    width={50}
                    height={50}
                    className="rounded-full w-10 h-10 object-cover"
                    draggable={false}
                  />
                </div>
                <div>
                  <h4 className="text-lg font-medium text-transparent bg-gradient-to-t from-white/90 to-white/65 bg-clip-text">
                    {item.name}
                  </h4>
                  <p className="text-xs text-muted-foreground font-extralight">
                    {item.position}
                  </p>
                </div>
              </CardHeader>
              <CardContent className="text-sm text-white/75 font-medium">
                {item.review}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

const data: {
  name: string;
  pp: string;
  position: string;
  rating: number;
  review: string;
}[] = [
  {
    name: "Chisato Nishikigi",
    pp: "https://images7.alphacoders.com/127/1275240.jpg",
    rating: 5,
    position: "Lyco Reco",
    review:
      "Ryomi is a wonderful tool that helps me to manage my videos and subtitles. Combined with the intuitive UI, it's a great tool for my workflow.",
  },
  {
    name: "Mahiru shina",
    position: "Best girl",
    pp: "https://images7.alphacoders.com/127/1275240.jpg",
    rating: 5,
    review:
      "Great tool at a affordable price. I've been using it for a while now and I'm very satisfied with the results. Would recommend to anyone.",
  },
  {
    name: "Mahiru",
    position: "Best boy",
    pp: "https://images7.alphacoders.com/127/1275240.jpg",
    rating: 5,
    review:
      "Helps me to reduce the size of my games captures. AI subtitles is a great feature. Great work by the dev",
  },
];
