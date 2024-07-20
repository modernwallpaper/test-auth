import { Button } from "../ui/button"
import { useLogoutMutation } from "@/states/slices/usersapi.slice"
import { logout } from "@/states/slices/auth.slice"
import { useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"

export const LogoutButton = () => {
  const [logoutApiCall] = useLogoutMutation();
  const dispatch  = useDispatch();
  const navigate = useNavigate();

  const onClick = async () => {
    try {
      await logoutApiCall({}).unwrap();
      dispatch(logout());
      navigate("/auth/login");
    } catch (error) {
      console.log(error); 
    }
  }

  return(
    <Button onClick={onClick}>
      Logout
    </Button>
  )
}
