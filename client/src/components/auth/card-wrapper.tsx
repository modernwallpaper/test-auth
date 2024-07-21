import { 
  Card,
  CardHeader,
  CardFooter,
  CardContent,
} from "../ui/card";
import { BackButton } from "./back-button";
import { Header } from "./header";

interface Props {
  children: React.ReactNode;
  header: string;
  backLabel: string;
  backHref: string;
}

export const CardWrapper = ({
  children,
  header,
  backLabel,
  backHref,
}: Props) => {
  return(
    <Card className="w-[400px]"> 
      <CardHeader>
        <Header label={header} />
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
      <CardFooter className="w-full items-center justify-center">
        <BackButton href={backHref} label={backLabel} /> 
      </CardFooter>
    </Card>
  )
}
