import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { ArrowRight, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

export function CtaSection() {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl bg-primary px-6 py-16 sm:px-12 sm:py-24">
          {/* Background decorations */}
          <div className="absolute top-0 right-0 size-96 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute bottom-0 left-0 size-96 rounded-full bg-white/5 blur-3xl" />

          <div className="relative mx-auto max-w-2xl text-center">
            <div className="mb-6 flex justify-center">
              <div className="flex size-14 items-center justify-center rounded-xl bg-white/10 text-white">
                <Zap className="size-7" />
              </div>
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
              Ready to Start Trading AI Credits?
            </h2>
            <p className="mt-4 text-lg text-white/80">
              Join thousands of developers and companies already trading on the
              open marketplace. Get started in minutes.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/register"
                className={cn(buttonVariants({ size: "lg", className: "h-12 px-8 text-base bg-white text-primary hover:bg-white/90" }))}
              >
                Create Free Account
                <ArrowRight className="ml-2 size-4" />
              </Link>
              <Link
                href="/about"
                className={cn(buttonVariants({ variant: "outline", size: "lg", className: "h-12 px-8 text-base border-white/20 text-white hover:bg-white/10" }))}
              >
                Learn More
              </Link>
            </div>

            <p className="mt-6 text-sm text-white/60">
              No credit card required. Free plan available.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
