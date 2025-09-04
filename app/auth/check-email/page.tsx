import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

export default function CheckEmailPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Check your email</CardTitle>
            <CardDescription>
              We&apos;ve sent you a confirmaiton link. Please check your email
              and click the link to active your account.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center text-sm">
              Already confirmed? <Link href="/auth/login" className=" underline underline-offset-4">Login</Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
