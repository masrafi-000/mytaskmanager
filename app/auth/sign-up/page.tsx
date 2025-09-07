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
import { useAppDispatch, useAppSelector } from "@/lib/hooks/redux";
import { signupUser } from "@/lib/store/authSlice";
import { Label } from "@radix-ui/react-label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { BsLinkedin } from "react-icons/bs";
import { FcGoogle } from "react-icons/fc";
import { SiGithub } from "react-icons/si";

export default function SignUpPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [formError, setFormError] = useState("");

  const dispatch = useAppDispatch();
  const { loading, error, success } = useAppSelector((state) => state.auth);
  const router = useRouter();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (password !== repeatPassword) {
      setFormError("Passwords do not match");
      return;
    }

    dispatch(signupUser({ name, email, password, repeatPassword }));
  };

  useEffect(() => {
    if (success) {
      router.push("/auth/check-email");
    }
  }, [success, router]);

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Sign up</CardTitle>
            <CardDescription>Create a new account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col gap-3">
                <div className="grid gap-2">
                  <Label htmlFor="name">
                    Full Name<span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">
                    Email<span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
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
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="repeat-password">
                    Repeat Password<span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="repeat-password"
                    type="password"
                    required
                    value={repeatPassword}
                    onChange={(e) => setRepeatPassword(e.target.value)}
                  />
                </div>
                {formError && (
                  <p className="text-sm text-red-500">{formError}</p>
                )}
                {error && <p className="text-sm text-red-500">{error}</p>}
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Creating account..." : "Sign up"}
                </Button>
                <hr />
                <p className="text-center text-sm text-gray-700">
                  Or sign-up with
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
                Already have an account?{" "}
                <Link
                  href="/auth/login"
                  className="underline underline-offset-4"
                >
                  Login
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
