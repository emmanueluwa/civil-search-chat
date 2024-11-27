"use client";
import { ModeToggle } from "@/components/mode-toggle";
import ReportComponent from "@/components/ReportComponent";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useToast } from "@/hooks/use-toast";
import { Settings } from "lucide-react";
import { useState } from "react";

type Props = {};

const HomeComponent = ({}: Props) => {
  const [documentData, setDocumentData] = useState("");
  const { toast } = useToast();

  const onDocumentConfirmation = (data: string) => {
    setDocumentData(data);

    toast({
      description: "Updated!",
    });
  };

  return (
    <div className="grid h-screen -w-full">
      <div className="flex flex-col">
        <header className="sticky top-0 z-10 h-[57px] bg-background flex items-center gap-1 border-b px-4">
          <h1 className="text-xl font-semibold text-gray-700">Miss Concrete</h1>
          <div className="w-full flex flex-row justify-end gap-2">
            <ModeToggle />
            <Drawer>
              <DrawerTrigger asChild>
                <Button variant={"outline"} size={"icon"} className="md:hidden">
                  <Settings />
                </Button>
              </DrawerTrigger>
              <DrawerContent aria-describedby={undefined} className="h-[80vh]">
                <DrawerTitle />
                <ReportComponent
                  onDocumentConfirmation={onDocumentConfirmation}
                />
              </DrawerContent>
            </Drawer>
          </div>
        </header>

        <main className="grid flex-1 gap-4 overflow-auto p-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="hidden md:flex flex-col">
            <ReportComponent onDocumentConfirmation={onDocumentConfirmation} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default HomeComponent;
