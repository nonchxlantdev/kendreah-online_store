"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock } from "lucide-react";
import { BrandLogo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAdminAuthStore } from "@/store/admin-auth-store";

export default function AdminLoginPage() {
  const router = useRouter();
  const enterDemo = useAdminAuthStore((s) => s.enterDemo);
  const signInDemo = useAdminAuthStore((s) => s.signInDemo);
  const [email, setEmail] = useState("admin@kendreah.demo");
  const [password, setPassword] = useState("demo-only");
  const [show, setShow] = useState(false);

  const go = () => {
    signInDemo(email);
    router.replace("/admin");
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    go();
  };

  return (
    <div className="flex min-h-dvh items-center justify-center bg-admin-bg px-4 py-10">
      <div className="w-full max-w-md border border-border bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-6 flex flex-col items-center text-center">
          <BrandLogo href={null} size="sm" />
          <h1 className="mt-5 font-display text-xl font-semibold text-ink">
            Store administrator
          </h1>
          <p className="mt-1 text-sm text-admin-muted">
            Ken&apos; Dreah Online Store — demo admin access
          </p>
        </div>

        <div className="mb-5 flex gap-2 border border-gold/40 bg-gold/10 px-3 py-2.5 text-xs text-ink">
          <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold-deep" />
          <p>
            Simulated authentication for presentation only. No real credentials
            are verified and this is not production-secure.
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={show ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pr-10"
                required
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-admin-muted"
                onClick={() => setShow((v) => !v)}
                aria-label={show ? "Hide password" : "Show password"}
              >
                {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <Button type="submit" variant="default" className="w-full" size="lg">
            Sign in
          </Button>
        </form>

        <Button
          type="button"
          variant="pink"
          className="mt-3 w-full"
          size="lg"
          onClick={() => {
            enterDemo();
            router.replace("/admin");
          }}
        >
          Enter Demo Dashboard
        </Button>
      </div>
    </div>
  );
}
