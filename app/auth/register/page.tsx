import { RegisterForm } from "@/components/auth/register-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Account | Ciah Accessorize",
  description: "Create your Ciah Accessorize account",
};

function getSafeCallbackUrl(callbackUrl?: string) {
  if (!callbackUrl || !callbackUrl.startsWith("/") || callbackUrl.startsWith("//")) {
    return undefined;
  }

  return callbackUrl;
}

interface RegisterPageProps {
  searchParams?: Promise<{
    callbackUrl?: string | string[];
  }>;
}

export default async function RegisterPage({ searchParams }: RegisterPageProps) {
  const params = searchParams ? await searchParams : undefined;
  const callbackUrl =
    typeof params?.callbackUrl === "string"
      ? getSafeCallbackUrl(params.callbackUrl)
      : undefined;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-2xl font-bold text-center mb-2">
            Create Account
          </h1>
          <p className="text-center text-gray-600 mb-8">
            Join Ciah Accessorize today
          </p>
          <RegisterForm callbackUrl={callbackUrl} />
        </div>
      </div>
    </div>
  );
}
