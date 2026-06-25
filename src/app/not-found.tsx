import Link from "next/link";
import { FileQuestion, ArrowLeft } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 animate-page-in">
      {/* Decorative background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 space-y-6 max-w-lg">
        {/* Icon with animated pulse/glow */}
        <div className="mx-auto w-24 h-24 rounded-full bg-secondary/50 border border-border flex items-center justify-center shadow-[0_0_50px_rgba(16,185,129,0.05)] mb-4">
          <FileQuestion className="w-12 h-12 text-primary" />
        </div>

        <div className="space-y-2">
          <h1 className="text-7xl font-extrabold tracking-tighter text-foreground font-mono">
            404
          </h1>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Page Not Found
          </h2>
          <p className="text-muted-foreground text-sm max-w-sm mx-auto leading-relaxed">
            The profile, country directory, or page you are looking for has been committed to a different branch or doesn&apos;t exist.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <Link
            href="/"
            className={buttonVariants({
              variant: "default",
              className: "w-full sm:w-auto font-bold shadow-md shadow-primary/10 cursor-pointer",
            })}
          >
            Back to Home
          </Link>
          <Link
            href="/developers"
            className={buttonVariants({
              variant: "outline",
              className: "w-full sm:w-auto border-border hover:bg-secondary cursor-pointer",
            })}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Explore Developers
          </Link>
        </div>
      </div>
    </div>
  );
}
