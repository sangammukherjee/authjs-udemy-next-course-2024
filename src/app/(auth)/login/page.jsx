"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignInSchema } from "@/config/schema";
import { ErrorMessage } from "@hookform/error-message";
import { signInAction } from "@/actions";
import { useToast } from "@/components/ui/use-toast";

function LoginPage() {
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isPending, startTransition] = useTransition();

  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values) => {
    setError(null);
    setSuccess(null);

    startTransition(() => {
      signInAction(values)
        .then((data) => {
          if (data?.error) {
            reset();
            setError(data.error);
          }

          if (data?.success) {
            reset();
            setSuccess(data.success);
          }
        })
        .catch((error) => setError(error));
    });
  };

  useEffect(() => {
    if (success) {
      toast({
        title: success,
      });
    }
  }, [success]);

  useEffect(() => {
    if (error) {
      toast({
        title: error,
        variant: "destructive",
      });
    }
  }, [error]);

  console.log(success, error);

  return (
    <div className="border border-gray-300 rounded-lg p-6 max-w-md shadow-sm max-md:mx-auto">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="mb-8">
          <h3 className="text-gray-900 text-3xl font-extrabold ">Sign In</h3>
        </div>
        <div>
          <Label className="text-gray-800 font-bold text-xl mb-2 block">
            Email
          </Label>
          <div className="relative flex items-center">
            <Input
              name="email"
              type="email"
              placeholder="Enter your email"
              {...register("email")}
              className="w-full text-sm text-gray-800 border border-gray-300 px-4 py-3 rounded-lg outline-blue-500"
            />
          </div>
          <ErrorMessage
            errors={errors}
            name="email"
            render={({ message }) => (
              <p className="text-red-700 mt-2 text-sm font-bold text-left w-full">
                {message}
              </p>
            )}
          />
        </div>
        <div>
          <Label className="text-gray-800 font-bold text-xl mb-2 block">
            Password
          </Label>
          <div className="relative flex items-center">
            <Input
              name="email"
              type="password"
              {...register("password")}
              placeholder="Enter your password"
              className="w-full text-sm text-gray-800 border border-gray-300 px-4 py-3 rounded-lg outline-blue-500"
            />
          </div>
          <ErrorMessage
            errors={errors}
            name="password"
            render={({ message }) => (
              <p className="text-red-700 mt-2 text-sm font-bold text-left w-full">
                {message}
              </p>
            )}
          />
          <div className="flex mt-2 flex-wrap items-center justify-end gap-4">
            <div className="text-sm">
              <Link
                href={"/reset-password"}
                className="text-blue-700 hover:underline font-semibold"
              >
                Forgot your password
              </Link>
            </div>
          </div>
          <div className="mt-8">
            <Button
              type="submit"
              disabled={isPending}
              className="h-10 w-full rounded-md bg-neutral-900 font-medium text-white"
            >
              Log In
            </Button>
          </div>
          <p className="text-sm mt-8 text-center text-gray-950">
            Don't have an account
            <Link
              href={"/register"}
              className="text-blue-600 font-semibold hover:underline ml-1 whitespace-nowrap"
            >
              Register here
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}

export default LoginPage;
