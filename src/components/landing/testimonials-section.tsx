"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";

const testimonials = [
  {
    quote:
      "AI Credits has completely changed how we manage our AI budget. We save 30% by buying credits in bulk during dips and selling when prices peak.",
    author: "Sarah Chen",
    role: "CTO, TechFlow AI",
    avatar: "SC",
  },
  {
    quote:
      "The real-time pricing data is invaluable. We can see market trends before anyone else and make informed decisions about our AI infrastructure spending.",
    author: "Marcus Johnson",
    role: "Head of Engineering, DataScale",
    avatar: "MJ",
  },
  {
    quote:
      "As a freelancer, I love being able to pick up extra credits when a client project needs more compute. The marketplace makes it easy and affordable.",
    author: "Aisha Patel",
    role: "Independent AI Developer",
    avatar: "AP",
  },
  {
    quote:
      "We moved our entire AI credit management to this platform. The escrow system gives us confidence, and the API integration was seamless.",
    author: "David Kim",
    role: "VP Engineering, NeuralOps",
    avatar: "DK",
  },
  {
    quote:
      "The best thing about AI Credits is the community. Trading with other developers, sharing insights about pricing trends -- it's a game changer.",
    author: "Elena Rodriguez",
    role: "Founder, AI Startup Hub",
    avatar: "ER",
  },
];

export function TestimonialsSection() {
  const [current, setCurrent] = useState(0);

  const next = () => {
    setCurrent((prev) => (prev + 1) % testimonials.length);
  };

  const prev = () => {
    setCurrent(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  };

  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Trusted by AI Builders
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            See what our community of traders and developers has to say.
          </p>
        </div>

        {/* Testimonial carousel */}
        <div className="relative mx-auto max-w-3xl">
          <Card className="overflow-hidden">
            <CardContent className="p-8 sm:p-12">
              <Quote className="size-8 text-primary/20 mb-4" />
              <blockquote className="text-lg sm:text-xl leading-relaxed text-foreground mb-8">
                &ldquo;{testimonials[current].quote}&rdquo;
              </blockquote>
              <div className="flex items-center gap-4">
                <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-sm">
                  {testimonials[current].avatar}
                </div>
                <div>
                  <div className="font-semibold text-foreground">
                    {testimonials[current].author}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {testimonials[current].role}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="mt-6 flex items-center justify-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={prev}
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="size-4" />
            </Button>

            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrent(index)}
                  className={`size-2 rounded-full transition-all ${
                    index === current
                      ? "bg-primary w-6"
                      : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={next}
              aria-label="Next testimonial"
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
