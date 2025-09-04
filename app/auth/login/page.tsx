"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BsLinkedin } from "react-icons/bs";
import { FcGoogle } from "react-icons/fc";
import { SiGithub } from "react-icons/si";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Login</CardTitle>
            <CardDescription>
              Enter your email below to login to your account
            </CardDescription>
          </CardHeader>
          <CardContent>
              <div className="flex flex-col space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">
                    Email<span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="try@examle.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">
                    Password<span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                {error && <p className="text-sm text-red-500">{error}</p>}
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Logging in..." : "Login"}
                </Button>
                <hr />
                <p className="text-center text-sm text-gray-700">
                  Or login with
                </p>
                <div className="grid grid-cols-3 items-center gap-3">
                  <button className="w-full h-10 flex items-center justify-center gap-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 shadow-md cursor-pointer transform transition-transform duration-200 hover:scale-105 hover:shadow-xl ">
                    <BsLinkedin size={20} className="text-[#0077B5]" />
                    <span className="text-sm font-medium">Linkedin</span>
                  </button>
                  <button className="w-full h-10 flex items-center justify-center space-x-2 rounded-full bg-white/15 backdrop-blur-md border border-white/20 shadow-md cursor-pointer transform transition-transform duration-200 hover:scale-105 hover:shadow-xl ">
                    <FcGoogle size={22} />
                    <span className="text-sm font-medium">Google</span>
                  </button>
                  <button className="w-full h-10 flex items-center justify-center gap-2 rounded-full bg-white/15 backdrop-blur-md border border-white/20 shadow-md cursor-pointer transform transition-transform duration-200 hover:scale-105 hover:shadow-xl ">
                    <SiGithub size={22} />
                    <span className="text-sm font-medium">Github</span>
                  </button>
                </div>
              </div>
              <div className="mt-4 text-center text-sm">
                don&apos;t have an account?{" "}
                <Link
                  href="/auth/sign-up"
                  className=" underline underline-offset-4"
                >
                  Sign up
                </Link>
              </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
