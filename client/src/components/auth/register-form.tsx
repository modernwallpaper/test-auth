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
import { RegisterSchema } from "@/schemas"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { FormError } from "../app/form-error"
import { FormSuccess } from "../app/form-success"
import { useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { useRegisterMutation } from "@/states/slices/usersapi.slice"
import { useSelector } from "react-redux"
import { useEffect, useState } from "react"
import { setCredentials } from "@/states/slices/auth.slice"
import { RootState } from "@/states/store"

export const RegisterForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [register, { isLoading }] = useRegisterMutation();
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);

  const { userInfo } = useSelector((state: RootState) => state.auth);
  useEffect(() => { 
    if(userInfo) navigate("/protected/settings");
  }, [navigate, userInfo]);

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
    },
  });

  const onSumbit = async (values: z.infer<typeof RegisterSchema>) => {
    try {
      const res = await register({ 
        name: values.name,
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
      header="Register"
      backLabel="Already have an account?"
      backHref="/auth/login"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSumbit)} className="space-y-6">
          <div className="space-y-4">
            <FormField 
              disabled={isLoading}
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex w-full justify-between items-center">
                    <p>Name</p>
                    <FormMessage />
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="someone" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
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
            Register  
          </Button>
        </form>
      </Form>
    </CardWrapper>
  )
}
