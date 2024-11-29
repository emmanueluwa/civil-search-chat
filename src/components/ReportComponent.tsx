import { ChangeEvent, useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Upload, FileText, Loader2 } from "lucide-react";

type Props = {
  onDocumentConfirmation: (data: string) => void;
};

function compressImage(file: File, callback: (compressedImage: File) => void) {
  const reader = new FileReader();

  reader.onload = (e) => {
    const img = new Image();

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      canvas.width = img.width;
      canvas.height = img.height;

      ctx!.drawImage(img, 0, 0);

      const quality = 0.1;
      const dataURL = canvas.toDataURL("image/jpeg", quality);

      const byteString = atob(dataURL.split(",")[1]);
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);

      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      const compressedFile = new File([ab], file.name, { type: "image/jpeg" });

      callback(compressedFile);
    };
    img.src = e.target!.result as string;
  };
  reader.readAsDataURL(file);
}

const ReportComponent = ({ onDocumentConfirmation }: Props) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [base64Data, setBase64Data] = useState("");
  const [documentData, setDocumentData] = useState("");
  const [fileName, setFileName] = useState("");

  function handleReportSelection(event: ChangeEvent<HTMLInputElement>): void {
    if (!event.target.files) return;

    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);
      const validImages = ["image/jpeg", "image/png", "image/webp"];
      const validDocs = ["application/pdf"];

      if (validImages.includes(file.type)) {
        compressImage(file, handleCompressedImage);
      } else if (validDocs.includes(file.type)) {
        handleDocumentFile(file);
      } else {
        toast({
          description: "Filetype not supported",
          variant: "destructive",
        });
      }
    }
  }

  function handleCompressedImage(compressedImage: File): void {
    const reader = new FileReader();
    reader.onloadend = () => {
      setBase64Data(reader.result as string);
    };
    reader.readAsDataURL(compressedImage);
  }

  function handleDocumentFile(file: File): void {
    const reader = new FileReader();
    reader.onloadend = () => {
      setBase64Data(reader.result as string);
    };
    reader.readAsDataURL(file);
  }

  async function extractDetails(): Promise<void> {
    if (!base64Data) {
      toast({
        description: "Upload a valid document",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("api/extract-document-gemini", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          base64: base64Data,
        }),
      });
      if (response.ok) {
        const documentText = await response.text();
        setDocumentData(documentText);
      } else {
        throw new Error("Failed to extract document details");
      }
    } catch (error) {
      toast({
        description: "Failed to extract document details",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-8 p-8 bg-white dark:bg-gray-900 rounded-2xl shadow-lg">
      <div className="space-y-2">
        <h2 className="text-2xl font-light text-gray-900 dark:text-white">
          Report Upload
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Upload a document or image to extract details.
        </p>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-center w-full">
          <label
            htmlFor="dropzone-file"
            className="flex flex-col items-center justify-center w-full h-48 border border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-900 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 transition-all duration-300 ease-in-out"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="w-8 h-8 mb-3 text-gray-400" />
              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                <span className="font-medium">Click to upload</span>
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 p-1 text-center">
                PDF, PNG, JPG or WEBP (MAX. 800x400px)
              </p>
            </div>
            <Input
              id="dropzone-file"
              type="file"
              className="hidden"
              onChange={handleReportSelection}
            />
          </label>
        </div>
        {fileName && (
          <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
            <FileText className="w-4 h-4" />
            <span>{fileName}</span>
          </div>
        )}
        <Button
          onClick={extractDetails}
          className="w-full bg-gray-900 hover:bg-gray-800 text-white dark:bg-white dark:hover:bg-gray-100 dark:text-gray-900 transition-colors duration-200"
          disabled={isLoading || !base64Data}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Extracting...
            </>
          ) : (
            <>Extract Details</>
          )}
        </Button>
      </div>

      <div className="space-y-2">
        <Label
          htmlFor="report-summary"
          className="text-sm font-medium text-gray-700 dark:text-gray-200"
        >
          Report Summary
        </Label>
        <Textarea
          id="report-summary"
          value={documentData}
          onChange={(e) => setDocumentData(e.target.value)}
          className="min-h-[200px] resize-none p-4 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-1 focus:ring-gray-500 focus:border-transparent transition-all duration-200 ease-in-out"
          placeholder="Extracted data from the document will appear here. Get better responses by providing additional information about the project if possible."
        />
      </div>

      <Button
        onClick={() => onDocumentConfirmation(documentData)}
        className="w-full bg-gray-900 hover:bg-gray-800 text-white dark:bg-white dark:hover:bg-gray-100 dark:text-gray-900 transition-colors duration-200"
        disabled={!documentData}
      >
        Continue
      </Button>
    </div>
  );
};

export default ReportComponent;
