export function PageError({ message }: { message: string }) {
  return (
    <div className="w-full h-[45rem] flex justify-center items-center">
      <p className="text-sm md:text-base lg:text-lg font-medium text-white/80">
        Error: {message}
      </p>
    </div>
  );
}
