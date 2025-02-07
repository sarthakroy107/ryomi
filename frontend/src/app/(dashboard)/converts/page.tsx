import { H2Heading } from "@/components/providers/h2-heading";

export default function UploadedFilePage() {
 
  return (
    <main className="w-full flex justify-center">
      <div className="lg:w-4/5">
        <H2Heading>Uploads</H2Heading>
        {/* <DataTable columns={uplaodedFileColumnsDef} data={dummyUploadedFile} /> */}
      </div>
    </main>
  );
}
