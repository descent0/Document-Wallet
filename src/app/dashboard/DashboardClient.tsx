"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { LogOut, Upload, FileText, User, Mail, Eye, Download } from "lucide-react";
import mammoth from "mammoth";

export default function DashboardClient({ user, documents }: any) {
  const router = useRouter();

  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeText, setActiveText] = useState<string | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);

  function handleFileChange(e: any) {
    const f = e.target.files[0];
    if (!f) return;

    if (
      ![
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ].includes(f.type)
    ) {
      setError("Only PDF & DOCX allowed");
      return;
    }

    if (f.size > 10 * 1024 * 1024) {
      setError("Max 10MB allowed");
      return;
    }

    setError("");
    setFile(f);
  }

  // tried too many times doing it on server but  ONLY SAFE WAY TO PARSE PDF WITH TURBOPACK
  async function extractPdf(file: File) {
  const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");

  pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/legacy/build/pdf.worker.min.mjs",
    import.meta.url
  ).toString();

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;

  let text = "";

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);

    const content = await page.getTextContent({
  disableCombineTextItems: true,
} as any);


    let lastY: number | null = null;


    const pageText = content.items
      .map((item: any) => {
        const currentY = item.transform[5];

        let lineBreak = "";
        if (lastY !== null && Math.abs(currentY - lastY) > 5) {
          lineBreak = "\n";
        }

        lastY = currentY;
        return lineBreak + item.str; 
      })
      .join(""); 

    text += pageText + "\n\n";
  }

  return text;
}


  async function handleUpload() {
    if (!file) return;

    setLoading(true);

    let extractedText = "";

    if (file.type === "application/pdf") {
      extractedText = await extractPdf(file);
    } else {
      const result = await mammoth.extractRawText({
        arrayBuffer: await file.arrayBuffer(),
      });
      extractedText = result.value;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("extractedText", extractedText);

    await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    setLoading(false);
    setFile(null);
    router.refresh();
  }

  async function handleLogout() {
    setLoggingOut(true);
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  async function handleDownloadDocument(doc: any) {
    const { data } = await supabase.storage
      .from("user-document")
      .download(doc.file_path);

    if (data) {
      const url = URL.createObjectURL(data);
      const a = document.createElement("a");
      a.href = url;
      a.download = doc.original_filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100">
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between">
          <div>
            <h1 className="text-2xl font-bold">Document Manager</h1>
            <p className="text-sm text-slate-600">
              Upload, manage & view documents
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:block text-right">
              <div className="flex items-center gap-2 text-sm font-medium">
                <User className="h-4 w-4" />
                {user.user_metadata?.full_name}
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <Mail className="h-3 w-3" />
                {user.email}
              </div>
            </div>

            <Button variant="outline" onClick={handleLogout} disabled={loggingOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Upload Document</CardTitle>
            <CardDescription>PDF & DOCX only (max 10MB)</CardDescription>
          </CardHeader>
          <CardContent className="flex gap-4 flex-col sm:flex-row">
            <Input type="file" onChange={handleFileChange} accept=".pdf,.docx" />
            <Button onClick={handleUpload} disabled={!file || loading}>
              <Upload className="h-4 w-4 mr-2" />
              {loading ? "Uploading..." : "Upload"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your Documents</CardTitle>
            <CardDescription>
              {documents.length} uploaded
            </CardDescription>
          </CardHeader>
          <CardContent>
            {documents.map((doc: any) => (
              <div
                key={doc.id}
                className="flex justify-between items-center border-b py-3"
              >
                <div>
                  <p className="font-medium">{doc.original_filename}</p>
                  <p className="text-sm text-slate-500">
                    {new Date(doc.uploaded_at).toISOString().slice(0, 10)}
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleDownloadDocument(doc)}>
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                  <Button size="sm" onClick={() => setActiveText(doc.extracted_text)}>
                    <FileText className="h-4 w-4 mr-1" />
                    View Text
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </main>

     <Dialog open={!!activeText} onOpenChange={() => setActiveText(null)}>
  <DialogContent className="border-none bg-transparent shadow-none flex items-center justify-center overflow-hidden max-w-none">

    {/* ✅ OUTER RESPONSIVE CONTAINER */}
    <div className="w-[90vw] max-w-[900px] flex justify-center">

      {/* ✅ SCALE WRAPPER */}
      <div
        className="origin-top"
        style={{
          transform: "scale(0.85)",   // ✅ AUTO SCALE CONTROL
        }}
      >

        {/* ✅ REAL A4 WIDTH (VISUAL ONLY) */}
        <div
          className="
            bg-white shadow-xl flex flex-col p-6 rounded-md
            w-[820px]    /* ✅ A4 visual width */
            h-[90vh]     /* ✅ Scroll height */
          "
        >
          <DialogHeader>
            <DialogTitle className="text-xl">
              Extracted Text (Raw Format)
            </DialogTitle>
          </DialogHeader>

          {/* ✅ ONLY CONTENT SCROLLS */}
          <div className="bg-slate-50 rounded-lg p-4 overflow-y-auto flex-1 mt-4">
            <pre className="whitespace-pre text-base font-mono leading-normal">
              {activeText}
            </pre>
          </div>

        </div>
      </div>
    </div>

  </DialogContent>
</Dialog>


    </div>
  );
}
