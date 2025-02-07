import { SelectFileModalTrigger } from "@/components/modals/operations";
import { OperationOptions } from "@/components/start-operation";

export default function OperationsPage() {
  return (
    <div className="w-full flex flex-col items-center">
      <SelectFileModalTrigger />
      <OperationOptions />
    </div>
  );
}
