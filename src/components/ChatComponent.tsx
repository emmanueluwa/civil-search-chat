import { useState, useRef, useEffect } from "react";
import MessageBox from "./MessageBox";
import { Badge } from "./ui/badge";
import { useChat } from "ai/react";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { CornerDownLeft, Loader2, PaperclipIcon } from "lucide-react";

type Props = {
  documentData: string;
};

const ChatComponent = ({ documentData }: Props) => {
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
      api: "api/civil-chat-gemini",
    });
  const [isMobile, setIsMobile] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="h-full bg-gray-50 dark:bg-gray-900 relative flex flex-col min-h-[50vh] rounded-2xl shadow-lg overflow-hidden">
      <div className="bg-white dark:bg-gray-800 p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
          Chat Assistant
        </h2>
        <Badge
          className={`${
            documentData
              ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
              : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100"
          }`}
          variant="outline"
        >
          {documentData ? (
            <>
              <PaperclipIcon className="w-3 h-3 mr-1" /> Document added
            </>
          ) : (
            "No document added"
          )}
        </Badge>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <MessageBox
            key={index}
            role={message.role}
            content={message.content}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form
        className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4"
        onSubmit={(event) => {
          event.preventDefault();
          handleSubmit(event, {
            data: {
              documentData: documentData,
            },
          });
        }}
      >
        <div className="flex items-end space-x-2">
          <Textarea
            value={input}
            onChange={handleInputChange}
            placeholder="Type your question here..."
            className="flex-1 min-h-[44px] max-h-[120px] p-2 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={1}
          />
          <Button
            disabled={isLoading || !input.trim()}
            className={`px-4 py-2 ${
              isMobile ? "h-[44px]" : ""
            } bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200`}
            type="submit"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <CornerDownLeft className="w-5 h-5" />
            )}
            <span className="ml-2 hidden sm:inline">
              {isLoading ? "Analyzing" : "Send"}
            </span>
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChatComponent;
