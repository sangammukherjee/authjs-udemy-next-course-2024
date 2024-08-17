"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignUpSchema } from "@/config/schema";
import { ErrorMessage } from "@hookform/error-message";
import { signUpAction } from "@/actions";
import { useToast } from "@/components/ui/use-toast";

function RegisterPage() {
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = (values) => {
    setError(null);
    setSuccess(null);

    startTransition(() => {
      signUpAction(values).then((data) => {
        console.log(data);
        setError(data.error);
        setSuccess(data.success);
        reset();
      });
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

  return (
    <div className="border border-gray-300 rounded-lg p-6 max-w-md shadow-sm max-md:mx-auto">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="mb-8">
          <h3 className="text-gray-900 text-3xl font-extrabold ">Sign Up</h3>
        </div>
        <div>
          <Label className="text-gray-800 font-bold text-xl mb-2 block">
            User Name
          </Label>
          <div className="relative flex items-center">
            <Input
              name="name"
              type="text"
              placeholder="Enter your user name"
              {...register("name")}
              className="w-full text-sm text-gray-800 border border-gray-300 px-4 py-3 rounded-lg outline-blue-500"
            />
          </div>
          <ErrorMessage
            errors={errors}
            name="name"
            render={({ message }) => (
              <p className="text-red-700 mt-2 text-sm font-bold text-left w-full">
                {message}
              </p>
            )}
          />
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
              name="password"
              type="password"
              {...register("password")}
              placeholder="Enter your email"
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
        </div>
        <div className="mt-8">
          <Button
            disabled={isPending}
            type="submit"
            className="h-10 w-full rounded-md bg-neutral-900 font-medium text-white"
          >
            Sign Up
          </Button>
        </div>
        <p className="text-sm mt-8 text-center text-gray-800">
          Already have an account
          <Link
            className="text-blue-600 font-semibold hover:underline ml-1 whitespace-nowrap"
            href={"/login"}
          >
            Login here
          </Link>
        </p>
      </form>
    </div>
  );
}

export default RegisterPage;
