"use client";

import Link from "next/link";
import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 animate-page-in">
      {/* Decorative background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-destructive/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 space-y-6 max-w-lg">
        {/* Icon with animated pulse/glow */}
        <div className="mx-auto w-24 h-24 rounded-full bg-destructive/10 border border-destructive/20 flex items-center justify-center shadow-[0_0_50px_rgba(239,68,68,0.05)] mb-4">
          <AlertTriangle className="w-12 h-12 text-destructive animate-pulse" />
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
            Something Went Wrong
          </h1>
          <p className="text-muted-foreground text-sm max-w-sm mx-auto leading-relaxed">
            An unexpected error occurred while loading this page. Our team of debuggers has been notified.
          </p>
          {error.digest && (
            <p className="text-xs font-mono text-muted-foreground/50 bg-secondary/30 border border-border/40 py-1.5 px-3 rounded-lg max-w-xs mx-auto overflow-hidden text-ellipsis">
              Digest: {error.digest}
            </p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <Button
            onClick={() => reset()}
            className="w-full sm:w-auto font-bold shadow-md shadow-primary/10 cursor-pointer"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
          <Link
            href="/"
            className={buttonVariants({
              variant: "outline",
              className: "w-full sm:w-auto border-border hover:bg-secondary cursor-pointer",
            })}
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
