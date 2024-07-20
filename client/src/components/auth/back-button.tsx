import { Button } from "../ui/button"

interface Props {
  href: string;
  label: string;
}

export const BackButton = ({
  label,
  href,
}: Props) => {
  return(
    <div>
      <Button asChild variant={"link"} className="flex w-full font-normal justify-center items-center" size={"sm"}>
        <a href={href}>
          {label}
        </a>
      </Button>
    </div>
  )
}
