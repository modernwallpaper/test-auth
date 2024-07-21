import { RootState } from "@/states/store";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const authmiddleware = (Component: React.ComponentType) => {
  const AuthComp = (props: any) => {
    const { userInfo } = useSelector((props: RootState) => props.auth);
    const navigate = useNavigate();

    useEffect(() => {
      if(!userInfo) return navigate("/auth/login");
    }, [userInfo, navigate])

    return <Component {...props} />
  }

  return AuthComp;
}

export default authmiddleware;
