import { DisplayCards } from "@/components/display-cards";
import { H2Heading } from "@/components/providers/h2-heading";
import { Separator } from "@/components/ui/separator";
import { FileUploadComponent } from "./upload-file";
import { SelectFileModalTrigger } from "@/components/modals/operations";
import { OperationOptions } from "@/components/start-operation";

export default function DashboardPage() {
  return (
    <main className="w-full flex flex-col items-center">
      <div className="lg:w-4/5 md:w-[90%] w-[95%] py-1.5 md:py-2.5 lg:py-4">
        <H2Heading>Dashboard</H2Heading>
        <DisplayCards />
        <div className="w-full flex justify-center">
          <Separator orientation="horizontal" className="my-7 lg:w-[15%]" />
        </div>
        <div className="w-full h-fit flex flex-col md:flex-row justify-around gap-y-8 md:gap-10 lg:gap-x-20">
          <FileUploadComponent />
          <div className="space-y-4 md:space-y-8 lg:w-[40rem]">
            <SelectFileModalTrigger />
            <OperationOptions />
          </div>
        </div>
      </div>
    </main>
  );
}
