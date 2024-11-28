import MessageBox from "./MessageBox";
import { Badge } from "./ui/badge";
import { useChat } from "ai/react";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { CornerDownLeft, Loader2 } from "lucide-react";

type Props = {
  documentData: string;
};

const ChatComponent = ({ documentData }: Props) => {
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
      api: "api/civil-chat-gemini",
    });

  return (
    <div className="h-full bg-muted/50 relative flex flex-col min-h-[50vh] rounded-xl p-4 gap-4">
      <Badge
        className={`absolute right-3 top-1.5 ${documentData && "bg-blue-300"}`}
        variant={"outline"}
      >
        {documentData ? "Document added" : "No document added"}
      </Badge>
      <div className="flex-1"></div>

      {/* messages */}
      <div className="flex flex-col gap-4">
        {messages.map((message, index) => {
          return (
            <MessageBox
              key={index}
              role={message.role}
              content={message.content}
            />
          );
        })}
      </div>

      {/* user input  */}
      <form
        className="relative overflow-hidden rounded-lg border bg-background"
        onSubmit={(event) => {
          event.preventDefault();
          handleSubmit(event, {
            data: {
              documentData: documentData,
            },
          });
        }}
      >
        <Textarea
          value={input}
          onChange={handleInputChange}
          placeholder="Type your question here..."
          className="min-h-12 resize-none border-0 p-3 shadow-none focus-visible:ring-0"
        />
        <div className="flex items-center p-3 pt-0">
          <Button
            disabled={isLoading}
            className="ml-auto"
            type="submit"
            size={"sm"}
          >
            {isLoading ? "Analyzing" : "3. Ask"}
            {isLoading ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <CornerDownLeft className="size-3.5" />
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChatComponent;
