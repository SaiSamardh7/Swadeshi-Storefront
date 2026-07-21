import { useState } from "react";
import { useLocation, useSearch } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRequestCode, useVerifyCode, getGetMeQueryKey } from "@workspace/api-client-react";
import { queryClient } from "@/lib/query-client";

// The "+1" is a fixed prefix in the UI (see the input below), so this only
// ever has to validate the 10-digit local number the customer typed —
// pasted formatting ("(469) 294-3500", a stray leading 1) is tolerated.
function normalizePhone(raw: string): string | null {
  let digits = raw.replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("1")) digits = digits.slice(1);
  return digits.length === 10 ? `+1${digits}` : null;
}

export default function Login() {
  const [, navigate] = useLocation();
  const search = useSearch();
  const next = new URLSearchParams(search).get("next") ?? "/cart";

  const [phoneInput, setPhoneInput] = useState("");
  const [phone, setPhone] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);

  const requestCode = useRequestCode();
  const verifyCode = useVerifyCode();

  function handleRequestCode(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const normalized = normalizePhone(phoneInput);
    if (!normalized) {
      setError("Enter a 10-digit US phone number.");
      return;
    }
    requestCode.mutate(
      { data: { phone: normalized } },
      {
        onSuccess: () => setPhone(normalized),
        onError: () => setError("Couldn't send a code. Check the number and try again."),
      },
    );
  }

  function handleVerifyCode(e: React.FormEvent) {
    e.preventDefault();
    if (!phone) return;
    setError(null);
    verifyCode.mutate(
      { data: { phone, code } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() });
          navigate(next);
        },
        onError: () => setError("That code is invalid or expired. Request a new one."),
      },
    );
  }

  return (
    <div className="container mx-auto max-w-sm px-4 py-16">
      <h1 className="text-2xl font-bold mb-1">
        {phone ? "Enter your code" : "Log in to order"}
      </h1>
      <p className="text-sm text-muted-foreground mb-6">
        {phone
          ? `We sent a 6-digit code to ${phone}.`
          : "We'll text you a one-time code — no password needed."}
      </p>

      {!phone ? (
        <form onSubmit={handleRequestCode} className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="flex h-10 shrink-0 items-center rounded-md border border-input bg-muted px-3 text-sm font-medium text-muted-foreground select-none">
              +1
            </span>
            <Input
              type="tel"
              inputMode="tel"
              autoFocus
              placeholder="(469) 294-3500"
              value={phoneInput}
              onChange={(e) => setPhoneInput(e.target.value)}
              aria-label="Phone number (US, without the +1)"
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" className="w-full rounded-full" disabled={requestCode.isPending}>
            {requestCode.isPending ? "Sending…" : "Send code"}
          </Button>
        </form>
      ) : (
        <form onSubmit={handleVerifyCode} className="space-y-4">
          <Input
            type="text"
            inputMode="numeric"
            autoFocus
            maxLength={6}
            placeholder="123456"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
            aria-label="6-digit code"
          />
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" className="w-full rounded-full" disabled={verifyCode.isPending}>
            {verifyCode.isPending ? "Verifying…" : "Verify & continue"}
          </Button>
          <button
            type="button"
            onClick={() => {
              setPhone(null);
              setCode("");
              setError(null);
            }}
            className="w-full text-sm text-muted-foreground hover:text-primary"
          >
            Use a different number
          </button>
        </form>
      )}
    </div>
  );
}
