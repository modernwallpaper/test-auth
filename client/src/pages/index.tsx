import { LoginButton } from "@/components/auth/login-button";
import { Button } from "@/components/ui/button";

export default function IndexPage() {
  return(
    <main className="flex h-full w-full flex-col items-center justify-center"> 
      <div className="space-y-6 text-center">
        <h1 className="scroll-m-20 text-4xl font-bold tracking-tight lg:text-5xl">
          TKDATHLETICS
        </h1>
        <p className="leading-7 font-normal [&:not(:first-child)]:mt-6 pb-5">
          A web service to analyse competitions from athletes. 
        </p>
        <LoginButton>
          <Button size={"lg"}>
            Login
          </Button>
        </LoginButton>
      </div>
    </main>
  )
}
