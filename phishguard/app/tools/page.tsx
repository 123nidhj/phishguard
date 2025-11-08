import EmailScanForm from "@/components/EmailScanForm";
import LinkScanForm from "@/components/LinkScanForm";
import DocumentScanForm from "@/components/DocumentScanForm";

export default function Home() {
  return (
    <main className="min-h-screen p-8 bg-gray-100 grid grid-cols-1 md:grid-cols-2 gap-6">
      <EmailScanForm />
      <LinkScanForm />
      <DocumentScanForm />
    </main>
  );
}
