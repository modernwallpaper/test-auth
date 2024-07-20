import { Suspense } from "react"
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import AuthLayout from "./pages/auth/auth.layout";
import HomePage from "./pages/index";
import LoginPage from "./pages/auth/login/login";
import RegisterPage from "./pages/auth/register/register";
import ProtectedLayout from "./pages/protected/protected.layout";
import SettingsPage from "./pages/protected/settings/settings";

function App() {
  return (
    <Router>
      <Suspense fallback={
        <div className="h-full w-full items-center justify-center">
          Loading...
        </div>
      }>
        <Routes>
          <Route path="/" element={ <HomePage /> }/>
          <Route path="/auth" element={ <AuthLayout /> }>
            <Route path="/auth/login" element={ <LoginPage /> }/>
            <Route path="/auth/register" element={ <RegisterPage /> }/>
          </Route>
          <Route path="/protected" element={ <ProtectedLayout /> }>
            <Route path="/protected/settings" element={ <SettingsPage /> } />
          </Route>
        </Routes>
      </Suspense>
    </Router>
  )
}

export default App
