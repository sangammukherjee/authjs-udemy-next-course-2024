"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { NewPasswordSchema } from "@/config/schema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { ErrorMessage } from "@hookform/error-message";
import { newPasswordAction } from "@/actions";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";

function NewPasswordPage() {
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isPending, startTransition] = useTransition();
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: {
      password: "",
    },
  });

  const handleSetNewPassword = (values) => {
    setError(null);
    setSuccess(null);

    startTransition(() => {
      newPasswordAction(values, token).then((data) => {
        if (data?.error) {
          setError(data.error);
        }

        if (data?.success) {
          setSuccess(data?.success);
          router.push("/login");
        }
      });
    });
  };

  useEffect(() => {
    if (error) {
      toast({
        title: error,
        variant: "destructive",
      });
    }
  }, [error]);

  useEffect(() => {
    if (success) {
      toast({
        title: success,
      });
    }
  }, [success]);

  return (
    <Card className="w-[400px]">
      <CardHeader className="mb-2">
        <CardTitle className="text-gray-900 text-3xl font-extrabold ">
          New Password
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={handleSubmit(handleSetNewPassword)}
          className="space-y-4"
        >
          <Input
            id="password"
            name="password"
            placeholder="Please enter new password here."
            type="password"
            {...register("password")}
            className="w-full text-sm text-gray-800 border border-gray-300 px-4 py-3 rounded-lg outline-blue-500"
          />
          <ErrorMessage
            errors={errors}
            name="password"
            render={({ message }) => (
              <p className="text-red-700 mt-2 text-sm font-bold text-left w-full">
                {message}
              </p>
            )}
          />
          <Button
            type="submit"
            disabled={isPending}
            className="h-10 w-full rounded-md bg-neutral-900 font-medium text-white"
          >
            Change Password
          </Button>
          <p className="text-sm mt-8 flex justify-end text-gray-950">
            <Link
              href={"/login"}
              className="text-blue-600 font-semibold hover:underline ml-1 whitespace-nowrap"
            >
              Back to login
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}

export default NewPasswordPage;
