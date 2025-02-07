import { RotateLoader } from "react-spinners";

export function PageLoader() {
  return (
    <div className="w-full h-[45rem] flex justify-center items-center">
      <RotateLoader color="#fff" size={12} />
    </div>
  );
}