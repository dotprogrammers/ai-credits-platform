"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  Quote,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Link,
  Image,
  Undo,
  Redo,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Save,
  Eye,
  FileText,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface BlogEditorProps {
  initialData?: {
    title?: string
    slug?: string
    excerpt?: string
    content?: string
    category?: string
    tags?: string[]
    status?: "draft" | "published" | "scheduled"
    featuredImage?: string
  }
  onSubmit?: (data: Record<string, unknown>) => void
}

export function BlogEditor({ initialData, onSubmit }: BlogEditorProps) {
  const [title, setTitle] = useState(initialData?.title ?? "")
  const [slug, setSlug] = useState(initialData?.slug ?? "")
  const [excerpt, setExcerpt] = useState(initialData?.excerpt ?? "")
  const [content, setContent] = useState(initialData?.content ?? "")
  const [category, setCategory] = useState(initialData?.category ?? "")
  const [tagInput, setTagInput] = useState("")
  const [tags, setTags] = useState<string[]>(initialData?.tags ?? [])
  const [status, setStatus] = useState(initialData?.status ?? "draft")
  const [activeFormats, setActiveFormats] = useState<Set<string>>(new Set())

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()])
      setTagInput("")
    }
  }

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag))
  }

  const toggleFormat = (format: string) => {
    setActiveFormats((prev) => {
      const next = new Set(prev)
      if (next.has(format)) {
        next.delete(format)
      } else {
        next.add(format)
      }
      return next
    })
  }

  const toolbarGroups = [
    {
      items: [
        { icon: Undo, format: "undo", label: "Undo" },
        { icon: Redo, format: "redo", label: "Redo" },
      ],
    },
    {
      items: [
        { icon: Heading1, format: "h1", label: "Heading 1" },
        { icon: Heading2, format: "h2", label: "Heading 2" },
        { icon: Heading3, format: "h3", label: "Heading 3" },
      ],
    },
    {
      items: [
        { icon: Bold, format: "bold", label: "Bold" },
        { icon: Italic, format: "italic", label: "Italic" },
        { icon: Underline, format: "underline", label: "Underline" },
        { icon: Strikethrough, format: "strike", label: "Strikethrough" },
      ],
    },
    {
      items: [
        { icon: List, format: "bullet", label: "Bullet List" },
        { icon: ListOrdered, format: "ordered", label: "Ordered List" },
        { icon: Quote, format: "quote", label: "Quote" },
        { icon: Code, format: "code", label: "Code" },
      ],
    },
    {
      items: [
        { icon: AlignLeft, format: "left", label: "Align Left" },
        { icon: AlignCenter, format: "center", label: "Center" },
        { icon: AlignRight, format: "right", label: "Align Right" },
      ],
    },
    {
      items: [
        { icon: Link, format: "link", label: "Insert Link" },
        { icon: Image, format: "image", label: "Insert Image" },
      ],
    },
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit?.({ title, slug, excerpt, content, category, tags, status })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title & Slug */}
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter blog post title..."
          className="h-10 text-lg font-medium"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="slug">Slug</Label>
          <Input
            id="slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="post-url-slug"
            className="font-mono text-sm"
          />
        </div>
        <div className="space-y-2">
          <Label>Category</Label>
          <Select value={category} onValueChange={(v) => v != null && setCategory(v)}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="news">News</SelectItem>
              <SelectItem value="tutorials">Tutorials</SelectItem>
              <SelectItem value="announcements">Announcements</SelectItem>
              <SelectItem value="market-insights">Market Insights</SelectItem>
              <SelectItem value="guides">Guides</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Excerpt */}
      <div className="space-y-2">
        <Label htmlFor="excerpt">Excerpt</Label>
        <Textarea
          id="excerpt"
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          placeholder="Brief summary of the post..."
          className="min-h-[60px]"
        />
      </div>

      {/* Tags */}
      <div className="space-y-2">
        <Label>Tags</Label>
        <div className="flex flex-wrap items-center gap-2">
          {tags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="cursor-pointer gap-1"
              onClick={() => removeTag(tag)}
            >
              {tag}
              <span className="text-[10px]">&times;</span>
            </Badge>
          ))}
          <Input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault()
                addTag()
              }
            }}
            placeholder="Add tag..."
            className="h-6 w-32 text-xs"
          />
        </div>
      </div>

      <Separator />

      {/* Rich Text Editor */}
      <div className="space-y-2">
        <Label>Content</Label>
        <div className="rounded-lg border">
          {/* Toolbar */}
          <div className="flex flex-wrap items-center gap-0.5 border-b p-1.5">
            {toolbarGroups.map((group, gi) => (
              <div key={gi} className="flex items-center">
                {gi > 0 && <div className="mx-1 h-5 w-px bg-border" />}
                {group.items.map((item) => {
                  const Icon = item.icon
                  const isActive = activeFormats.has(item.format)
                  return (
                    <button
                      key={item.format}
                      type="button"
                      onClick={() => toggleFormat(item.format)}
                      title={item.label}
                      className={cn(
                        "flex size-7 items-center justify-center rounded-md transition-colors",
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      <Icon className="size-3.5" />
                    </button>
                  )
                })}
              </div>
            ))}
          </div>

          {/* Editor Area */}
          <div className="relative">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your blog post content here...

Use the toolbar above to format your text. This editor supports:
- Headings (H1, H2, H3)
- Text formatting (Bold, Italic, Underline)
- Lists (Ordered, Unordered)
- Blockquotes and Code blocks
- Links and Images"
              className="min-h-[400px] w-full resize-y p-4 text-sm leading-relaxed outline-none placeholder:text-muted-foreground"
            />
          </div>

          {/* Status Bar */}
          <div className="flex items-center justify-between border-t px-3 py-1.5 text-[10px] text-muted-foreground">
            <span>{content.split(/\s+/).filter(Boolean).length} words</span>
            <span>{content.length} characters</span>
          </div>
        </div>
      </div>

      {/* Featured Image */}
      <div className="space-y-2">
        <Label>Featured Image</Label>
        <div className="flex h-32 items-center justify-center rounded-lg border-2 border-dashed">
          <div className="text-center">
            <Image className="mx-auto size-8 text-muted-foreground" />
            <p className="mt-2 text-xs text-muted-foreground">
              Click or drag to upload featured image
            </p>
            <p className="text-[10px] text-muted-foreground">1200x630 recommended</p>
          </div>
        </div>
      </div>

      <Separator />

      {/* Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Select value={status} onValueChange={(v) => v != null && setStatus(v as typeof status)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="scheduled">Scheduled</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" type="button" className="gap-1.5">
            <Eye className="size-3.5" />
            Preview
          </Button>
        </div>
        <div className="flex gap-2">
          <Button type="button" variant="outline">
            Save Draft
          </Button>
          <Button type="submit" className="gap-1.5">
            <Save className="size-3.5" />
            {status === "published" ? "Publish" : "Save"}
          </Button>
        </div>
      </div>
    </form>
  )
}
