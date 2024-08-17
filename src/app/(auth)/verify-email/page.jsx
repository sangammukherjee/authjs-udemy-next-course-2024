"use client";

import { verifyEmailAction } from "@/actions";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

function VerifyEmailPage() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const router = useRouter();
  const searchParams = useSearchParams();

  const getTokenValue = searchParams.get("token");

  const handleVerifyEmail = useCallback(() => {
    if (success || error) return;

    if (!handleVerifyEmail) {
      setError("Missing token value");
      return;
    }

    verifyEmailAction(getTokenValue)
      .then((data) => {
        if (data.success) {
          setSuccess(data.success);
          router.push("/login");
        }
        setError(data.error);
      })
      .catch(() => setError("Error occured! Please try again"));
  }, [getTokenValue, success, error]);

  useEffect(() => {
    handleVerifyEmail();
  }, [handleVerifyEmail]);

  return (
    <div>
      {!success && !error && <h1>Verifying! Please wait</h1>}
      {success ? (
        <Card>
          <CardHeader>
            <CardTitle>{success}</CardTitle>
          </CardHeader>
        </Card>
      ) : null}
      {error ? (
        <Card>
          <CardHeader>
            <CardTitle>{error}</CardTitle>
          </CardHeader>
        </Card>
      ) : null}
    </div>
  );
}

export default VerifyEmailPage;
