import { CardWrapper } from "./card-wrapper"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import * as z from "zod"
import { LoginSchema } from "@/schemas"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { FormError } from "../app/form-error"
import { FormSuccess } from "../app/form-success"
import { useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { useLoginMutation } from "@/states/slices/usersapi.slice"
import { useSelector } from "react-redux"
import { useEffect, useState } from "react"
import { setCredentials } from "@/states/slices/auth.slice"
import { RootState } from "@/states/store"

export const LoginForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [login, { isLoading }] = useLoginMutation();
  const { userInfo } = useSelector((state: RootState) => state.auth);

  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);

  useEffect(() => { 
    if(userInfo) navigate("/protected/settings");
  }, [navigate, userInfo]);

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSumbit = async (values: z.infer<typeof LoginSchema>) => {
    try {
      const res = await login({ 
        email: values.email,
        password: values.password,
      }).unwrap();
      dispatch(setCredentials({...res}));
      navigate("/protected/settings");
    } catch (err) {
      if (err && typeof err === "object" && "data" in err) {
        const errorData = err as { data: { message: string } };
        setErrorMessage(errorData.data.message);
      } else {
        setErrorMessage("An unexpected error occurred");
      }
    }
  }

  return(
    <CardWrapper
      header="Login"
      backLabel="Don't have an account?"
      backHref="/auth/register"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSumbit)} className="space-y-6">
          <div className="space-y-4">
            <FormField 
              disabled={isLoading}
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex w-full justify-between items-center">
                    <p>Email</p>
                    <FormMessage />
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="someone@example.com" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField 
              disabled={isLoading}
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex w-full justify-between items-center">
                    <p>Password</p>
                    <FormMessage />
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="******" type="password" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <FormError message={errorMessage} />
          <FormSuccess message="" />
          <Button disabled={isLoading} type="submit" className="w-full">
            Login
          </Button>
        </form>
      </Form>
    </CardWrapper>
  )
}
