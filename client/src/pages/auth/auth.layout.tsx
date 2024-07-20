import React from "react";
import { Outlet } from "react-router-dom"; 

const AuthLayout: React.FC = () => {
  return(
    <main className="flex w-full h-full items-center justify-center">
      <Outlet />
    </main>
  )
}

export default AuthLayout;
