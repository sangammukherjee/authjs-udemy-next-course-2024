import { Suspense } from "react";
import LoadingPage from "./loading";

function AuthLayout({ children }) {
  return (
    <div>
      <div className="min-h-screen flex flex-col items-center justify-center py-6 px-4">
        <div className="grid md:grid-cols-2 items-center gap-4 max-w-6xl w-full">
          <div className="lg:h-[400px] md:h-[300px] max-md:mt-8">
            <img
              src="https://shorturl.at/G7R1I"
              alt="Next auth"
              className="h-full w-full max-md:w-4/5 mx-auto block object-cover"
            />
          </div>
          <Suspense fallback={<LoadingPage />}>{children}</Suspense>
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;
