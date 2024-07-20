import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import { RootState } from "@/states/store"

export default function ProtectedLayout() {
  const { userInfo } = useSelector((state: RootState) => state.auth);  
  const navigate = useNavigate();

  useEffect(() => {
    if(!userInfo) navigate("/auth/login"); 
  }, [navigate, userInfo])

  return(
    <main className="w-full h-full">
      <Outlet />
    </main>
  )
}
