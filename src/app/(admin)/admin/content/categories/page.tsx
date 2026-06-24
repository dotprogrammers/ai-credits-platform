"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Edit, Trash2, FolderTree } from "lucide-react"

interface Category {
  id: string
  name: string
  slug: string
  description: string
  postCount: number
}

const mockCategories: Category[] = [
  { id: "1", name: "News", slug: "news", description: "Platform and industry news", postCount: 24 },
  { id: "2", name: "Tutorials", slug: "tutorials", description: "Step-by-step guides and tutorials", postCount: 18 },
  { id: "3", name: "Announcements", slug: "announcements", description: "Platform updates and announcements", postCount: 12 },
  { id: "4", name: "Market Insights", slug: "market-insights", description: "Analysis and market trends", postCount: 8 },
  { id: "5", name: "Guides", slug: "guides", description: "Beginner and advanced guides", postCount: 15 },
]

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState(mockCategories)
  const [showDialog, setShowDialog] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [formName, setFormName] = useState("")
  const [formSlug, setFormSlug] = useState("")
  const [formDescription, setFormDescription] = useState("")

  const openCreate = () => {
    setEditingCategory(null)
    setFormName("")
    setFormSlug("")
    setFormDescription("")
    setShowDialog(true)
  }

  const openEdit = (cat: Category) => {
    setEditingCategory(cat)
    setFormName(cat.name)
    setFormSlug(cat.slug)
    setFormDescription(cat.description)
    setShowDialog(true)
  }

  const handleSave = () => {
    if (editingCategory) {
      setCategories(
        categories.map((c) =>
          c.id === editingCategory.id
            ? { ...c, name: formName, slug: formSlug, description: formDescription }
            : c
        )
      )
    } else {
      setCategories([
        ...categories,
        {
          id: String(categories.length + 1),
          name: formName,
          slug: formSlug,
          description: formDescription,
          postCount: 0,
        },
      ])
    }
    setShowDialog(false)
  }

  const handleDelete = (id: string) => {
    setCategories(categories.filter((c) => c.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Categories</h1>
          <p className="text-sm text-muted-foreground">
            Manage blog post categories
          </p>
        </div>
        <Button size="sm" className="gap-1.5" onClick={openCreate}>
          <Plus className="size-3.5" />
          Add Category
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((cat) => (
          <Card key={cat.id}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10">
                    <FolderTree className="size-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold">{cat.name}</h3>
                    <p className="text-xs text-muted-foreground font-mono">/{cat.slug}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon-xs" onClick={() => openEdit(cat)}>
                    <Edit className="size-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    className="text-red-600"
                    onClick={() => handleDelete(cat.id)}
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">{cat.description}</p>
              <div className="mt-3">
                <Badge variant="secondary">{cat.postCount} posts</Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? "Edit Category" : "New Category"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="Category name"
              />
            </div>
            <div className="space-y-2">
              <Label>Slug</Label>
              <Input
                value={formSlug}
                onChange={(e) => setFormSlug(e.target.value)}
                placeholder="category-slug"
                className="font-mono"
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Input
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder="Brief description..."
              />
            </div>
            <Button className="w-full" onClick={handleSave}>
              {editingCategory ? "Update" : "Create"} Category
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
