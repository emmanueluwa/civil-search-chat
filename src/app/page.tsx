export const maxDuration = 50;

("use client");
import { useState } from "react";
import ChatComponent from "@/components/ChatComponent";
import { ModeToggle } from "@/components/mode-toggle";
import ReportComponent from "@/components/ReportComponent";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useToast } from "@/hooks/use-toast";
import { Settings } from "lucide-react";

const HomeComponent = () => {
  const [documentData, setDocumentData] = useState("");
  const { toast } = useToast();

  const onDocumentConfirmation = (data: string) => {
    setDocumentData(data);
    toast({
      description: "Updated!",
    });
  };

  return (
    <div className="flex h-screen flex-col bg-gray-50 dark:bg-gray-900">
      <header className="sticky top-0 z-10 backdrop-blur-lg bg-white/75 dark:bg-gray-900/75 border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Miss Concrete
          </h1>
          <div className="flex items-center space-x-4">
            <ModeToggle />
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Settings className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[90vw] sm:w-[385px]">
                <SheetTitle>Settings</SheetTitle>
                <ReportComponent
                  onDocumentConfirmation={onDocumentConfirmation}
                />
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-hidden">
        <div className="container mx-auto h-full p-4 md:p-6 flex flex-col md:flex-row gap-6">
          <div className="hidden md:flex md:w-1/3 lg:w-1/4 flex-col">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 h-full overflow-auto">
              <ReportComponent
                onDocumentConfirmation={onDocumentConfirmation}
              />
            </div>
          </div>
          <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 overflow-auto">
            <ChatComponent documentData={documentData} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomeComponent;
