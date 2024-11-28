import { Card, CardContent, CardFooter } from "./ui/card";

type Props = {
  role: string;
  content: string;
};

const MessageBox = ({ role, content }: Props) => {
  return (
    <Card>
      <CardContent className="p-6 text-sm">{content}</CardContent>
      {role !== "user" && (
        <CardFooter className="border-t bg-muted/50 px-6 py-3 text-xs text-muted-foreground">
          Disclaimer 🚧: Miss Concrete has no formal qualifications as an
          engineer, her knowledge is based on your uploaded documents, industry
          data, rules and formulas. Please seek professional advice on any
          information she gives.
        </CardFooter>
      )}
    </Card>
  );
};

export default MessageBox;
