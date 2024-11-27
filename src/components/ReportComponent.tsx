import { ChangeEvent, useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { useToast } from "@/hooks/use-toast";

type Props = {
  onDocumentConfirmation: (data: string) => void;
};

function compressImage(file: File, callback: (compressedImage: File) => void) {
  const reader = new FileReader();

  reader.onload = (e) => {
    const img = new Image();

    img.onload = () => {
      //create canvas element
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      //set canvas dimensions to match image
      canvas.width = img.width;
      canvas.height = img.height;

      //draw image onto canvas
      ctx!.drawImage(img, 0, 0);

      //apply basic compression adjusting quality as needed
      const quality = 0.1;

      //convert canvas to data url
      const dataURL = canvas.toDataURL("image/jpeg", quality);

      //convert data url back to blob
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

  function handleReportSelection(event: ChangeEvent<HTMLInputElement>): void {
    if (!event.target.files) return;

    const file = event.target.files[0]; //for one file upload
    if (file) {
      let isValidImage = false;
      let isValidDoc = false;

      const validImages = ["image/jpeg", "image/png", "image/webp"];
      const validDocs = ["application/pdf"];

      if (validImages.includes(file.type)) {
        isValidImage = true;
      }

      if (validDocs.includes(file.type)) {
        isValidDoc = true;
      }

      if (!(isValidDoc || isValidImage)) {
        toast({
          description: "Filetype not supported",
          variant: "destructive",
        });
        return;
      }

      if (isValidDoc) {
        const reader = new FileReader();
        reader.onloadend = () => {
          //base64 string version of file
          const fileContent = reader.result as string;

          setBase64Data(fileContent);
        };

        reader.readAsDataURL(file);
      }

      if (isValidImage) {
        compressImage(file, (compressedImage: File) => {
          const reader = new FileReader();

          reader.onloadend = () => {
            //base64 string version of file
            const imageContent = reader.result as string;

            setBase64Data(imageContent);
          };

          reader.readAsDataURL(compressedImage);
        });
      }
    }
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
      setIsLoading(false);
    }
  }

  return (
    <div className="grid w-full items-start gap-6 overflow-auto p-4 pt-0">
      <fieldset className="relative grid gap-6 rounded-lg border p-4">
        <legend className="text-sm font-medium">Report</legend>
        {isLoading && (
          <div className="absolute z-10 h-full w-full bg-card/90 rounded-lg flex flex-row items-center justify-center">
            extracting...
          </div>
        )}
        <Input type="file" onChange={handleReportSelection} />

        <Button onClick={extractDetails}>1. Upload file</Button>

        <Label>Report Summary</Label>

        <Textarea
          value={documentData}
          onChange={(e) => {
            setDocumentData(e.target.value);
          }}
          className="min-h-72 resize-none border-0 p-3 shadow-none focus-visible:ring-0"
          placeholder="Extracted data from the document will appear here. Get better responses by providing additional information about the project if possible."
        />
        <Button
          onClick={() => {
            onDocumentConfirmation(documentData);
          }}
          className="bg-gray-600"
        >
          2. Continue
        </Button>
      </fieldset>
    </div>
  );
};

export default ReportComponent;
