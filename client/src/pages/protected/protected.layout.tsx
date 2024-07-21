import authmiddleware from "@/providers/middleware";
import { Outlet } from "react-router-dom";

const ProtectedLayout = () => {
  return(
    <main className="w-full h-full">
      <Outlet />
    </main>
  )
}

export default authmiddleware(ProtectedLayout);
