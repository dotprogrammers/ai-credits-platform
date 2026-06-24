import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { FileQuestion, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <div className="flex flex-1 items-center justify-center">
      <div className="mx-auto max-w-md px-4 py-32 text-center">
        <div className="mb-6 flex justify-center">
          <div className="flex size-16 items-center justify-center rounded-full bg-muted">
            <FileQuestion className="size-8 text-muted-foreground" />
          </div>
        </div>

        <h1 className="text-4xl font-bold tracking-tight mb-2">404</h1>
        <h2 className="text-xl font-semibold mb-4">Page not found</h2>
        <p className="text-muted-foreground mb-8">
          Sorry, we couldn&apos;t find the page you&apos;re looking for. It
          might have been moved, deleted, or never existed.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/" className={cn(buttonVariants())}>
            <ArrowLeft className="mr-2 size-4" />
            Back to Home
          </Link>
          <Link href="/blog" className={cn(buttonVariants({ variant: "outline" }))}>
            Browse Blog
          </Link>
        </div>
      </div>
    </div>
  );
}
