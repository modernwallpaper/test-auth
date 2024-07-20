import { LogoutButton } from "@/components/auth/logout-button";
import { RootState } from "@/states/store";
import { useSelector } from "react-redux";

export default function SettingsPage() {
  const { userInfo } = useSelector((state: RootState) => state.auth);
  
  return(
    <div>
      {JSON.stringify(userInfo)}
      <LogoutButton />
    </div>
  )
}
