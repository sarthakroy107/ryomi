import Image from "next/image";
import * as motion from "motion/react-client";

export function Companies() {
  return (
    <motion.div
      initial={{ y: 0, opacity: 0 }}
      animate={{
        y: 0,
        opacity: 1,
        transition: { delay: 1.8 },
      }}
      className="text-muted-foreground font-semibold w-2/3"
    >
      <p className="text-base text-center">
        {" "}
        <span className="text-xs font-extralight mr-1 text-white/20">
          not
        </span>{" "}
        TRUSTED BY
      </p>
      <div className="infinite-scroll-wrapper">
        <Image
          className="infinite-scroll-item infinite-scroll-item-1 -top-3"
          src="/companies/resend.svg"
          alt="Resend"
          width={200}
          height={200}
          draggable={false}
        />
        <Image
          className="infinite-scroll-item infinite-scroll-item-2 -top-2"
          src="/companies/pwc.svg"
          alt="Airbnb"
          width={200}
          height={200}
          draggable={false}
        />
        <Image
          className="infinite-scroll-item infinite-scroll-item-3"
          src="/companies/loops.svg"
          alt="PWC"
          width={200}
          height={200}
          draggable={false}
        />
        <Image
          className="infinite-scroll-item infinite-scroll-item-4 top-1"
          src="/companies/1password.svg"
          alt="Loops"
          width={200}
          height={200}
          draggable={false}
        />
        <Image
          className="infinite-scroll-item infinite-scroll-item-5 top-1.5"
          src="/companies/chatbase.svg"
          alt="1Password"
          width={200}
          height={200}
          draggable={false}
        />
        <Image
          className="infinite-scroll-item infinite-scroll-item-6"
          src="/companies/github.svg"
          alt="Chatbase"
          width={200}
          height={200}
          draggable={false}
        />
      </div>
    </motion.div>
  );
}
