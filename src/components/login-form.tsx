import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "./ui/field";
import { Input } from "@/components/ui/input";
import { getRouteApi, useNavigate, useRouter } from "@tanstack/react-router";
import { useAuth } from "@/contexts/auth.context";
import React from "react";
import { Spinner } from "./ui/spinner";

interface Props {
  className?: string;
}
export function LoginForm({ className }: Props) {
  const route = getRouteApi("/login");
  const { redirect } = route.useSearch();
  const router = useRouter();
  const navigate = useNavigate();

  const { signIn } = useAuth();
  const [loading, setLoading] = React.useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    try {
      setLoading(true);
      e.preventDefault();
      const formData = new FormData(e.currentTarget as HTMLFormElement);
      const username = formData.get("username") as string;
      const password = formData.get("password") as string;

      await signIn(username, password);
      await router.invalidate();
      await navigate({ to: redirect });
    } catch (error) {
      console.log(error); // Handle login exceptio
    } finally {
      setLoading(false);
    }
  };
  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      onSubmit={handleLogin}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Login to your account</h1>
          <p className="text-sm text-balance text-muted-foreground">
            Enter your email below to login to your account
          </p>
        </div>
        <Field>
          <FieldLabel htmlFor="username">Username</FieldLabel>
          <Input id="username" name="username" required />
        </Field>
        <Field>
          <div className="flex items-center">
            <FieldLabel htmlFor="password">Password</FieldLabel>
          </div>
          <Input id="password" name="password" type="password" required />
        </Field>
        <Field>
          {!loading ? (
            <Button type="submit">Login</Button>
          ) : (
            <Button disabled>
              <Spinner />
            </Button>
          )}
        </Field>
      </FieldGroup>
    </form>
  );
}
