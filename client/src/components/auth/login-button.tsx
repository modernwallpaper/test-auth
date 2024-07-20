import { useNavigate } from "react-router-dom";

interface Props {
  children: React.ReactNode;
  mode?: "modal" | "redirect";
  asChild?: boolean;
}

export const LoginButton = ({
  children,
  mode = "redirect",
  //asChild,
}: Props) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate("/auth/login");
  }

  if(mode === "modal") {
    return(
      <span>
        TODO: Implement Modal
      </span>
    )
  }

  return(
    <span className="cursor-pointer" onClick={handleClick}>
      {children}
    </span>
  )
}
