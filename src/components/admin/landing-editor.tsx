"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  GripVertical,
  Eye,
  EyeOff,
  ChevronUp,
  ChevronDown,
  Trash2,
  Save,
  Plus,
  Type,
  Image,
  LayoutGrid,
  MessageSquare,
  Users,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface LandingSection {
  id: string
  type: "hero" | "features" | "stats" | "testimonials" | "cta"
  title: string
  visible: boolean
  content: Record<string, string>
}

const initialSections: LandingSection[] = [
  {
    id: "1",
    type: "hero",
    title: "Hero Section",
    visible: true,
    content: {
      headline: "Trade AI Credits with Confidence",
      subheadline: "The leading marketplace for buying, selling, and trading AI model credits across providers.",
      ctaText: "Start Trading",
    },
  },
  {
    id: "2",
    type: "features",
    title: "Features Grid",
    visible: true,
    content: {
      title: "Why Choose AI Credits",
      description: "Everything you need to trade AI credits efficiently",
    },
  },
  {
    id: "3",
    type: "stats",
    title: "Statistics Bar",
    visible: true,
    content: {
      stat1: "24,000+ Users",
      stat2: "$1.4M Volume",
      stat3: "150K+ Trades",
      stat4: "12 Providers",
    },
  },
  {
    id: "4",
    type: "testimonials",
    title: "Testimonials",
    visible: false,
    content: {
      title: "What Our Users Say",
    },
  },
  {
    id: "5",
    type: "cta",
    title: "Call to Action",
    visible: true,
    content: {
      headline: "Ready to Start Trading?",
      description: "Join thousands of traders on the AI Credits platform.",
      ctaText: "Create Account",
    },
  },
]

const sectionIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  hero: Type,
  features: LayoutGrid,
  stats: LayoutGrid,
  testimonials: MessageSquare,
  cta: Users,
}

export function LandingEditor() {
  const [sections, setSections] = useState(initialSections)

  const toggleVisibility = (id: string) => {
    setSections(
      sections.map((s) => (s.id === id ? { ...s, visible: !s.visible } : s))
    )
  }

  const moveSection = (id: string, direction: "up" | "down") => {
    const index = sections.findIndex((s) => s.id === id)
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === sections.length - 1)
    )
      return
    const newSections = [...sections]
    const swapIndex = direction === "up" ? index - 1 : index + 1
    ;[newSections[index], newSections[swapIndex]] = [newSections[swapIndex], newSections[index]]
    setSections(newSections)
  }

  const updateContent = (id: string, key: string, value: string) => {
    setSections(
      sections.map((s) =>
        s.id === id ? { ...s, content: { ...s.content, [key]: value } } : s
      )
    )
  }

  const deleteSection = (id: string) => {
    setSections(sections.filter((s) => s.id !== id))
  }

  return (
    <div className="space-y-4">
      {sections.map((section, index) => {
        const Icon = sectionIcons[section.type] || LayoutGrid
        return (
          <Card
            key={section.id}
            className={cn(!section.visible && "opacity-50")}
          >
            <CardHeader className="flex-row items-center gap-3 space-y-0 pb-2">
              <GripVertical className="size-4 text-muted-foreground cursor-grab" />
              <div className="flex size-8 items-center justify-center rounded-md bg-primary/10">
                <Icon className="size-4 text-primary" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-sm">{section.title}</CardTitle>
                <Badge variant="outline" className="mt-0.5 text-[10px] capitalize">
                  {section.type}
                </Badge>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon-xs"
                  onClick={() => moveSection(section.id, "up")}
                  disabled={index === 0}
                >
                  <ChevronUp className="size-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-xs"
                  onClick={() => moveSection(section.id, "down")}
                  disabled={index === sections.length - 1}
                >
                  <ChevronDown className="size-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-xs"
                  onClick={() => toggleVisibility(section.id)}
                >
                  {section.visible ? (
                    <Eye className="size-3.5" />
                  ) : (
                    <EyeOff className="size-3.5" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon-xs"
                  className="text-red-600"
                  onClick={() => deleteSection(section.id)}
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {Object.entries(section.content).map(([key, value]) => (
                <div key={key} className="space-y-1">
                  <Label className="text-xs capitalize">
                    {key.replace(/([A-Z])/g, " $1").trim()}
                  </Label>
                  {value.length > 80 ? (
                    <Textarea
                      value={value}
                      onChange={(e) => updateContent(section.id, key, e.target.value)}
                      className="min-h-[60px] text-sm"
                    />
                  ) : (
                    <Input
                      value={value}
                      onChange={(e) => updateContent(section.id, key, e.target.value)}
                      className="text-sm"
                    />
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        )
      })}

      <div className="flex justify-center">
        <Button variant="outline" className="gap-1.5">
          <Plus className="size-3.5" />
          Add Section
        </Button>
      </div>

      <div className="flex justify-end">
        <Button className="gap-1.5">
          <Save className="size-3.5" />
          Save Changes
        </Button>
      </div>
    </div>
  )
}
