"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Search, Plus, Edit, Trash2, Eye } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

const mockPosts = [
  { id: "1", title: "Understanding AI Credit Markets", author: "Admin", category: "Guides", status: "published", date: "2024-06-15", views: 1240 },
  { id: "2", title: "New Provider: Google Gemini Integration", author: "Admin", category: "News", status: "published", date: "2024-06-14", views: 890 },
  { id: "3", title: "Trading Strategies for AI Credits", author: "Admin", category: "Tutorials", status: "draft", date: "2024-06-13", views: 0 },
  { id: "4", title: "Platform Update: Auction System v2", author: "Admin", category: "Announcements", status: "published", date: "2024-06-12", views: 2100 },
  { id: "5", title: "How KYC Verification Works", author: "Admin", category: "Guides", status: "published", date: "2024-06-10", views: 650 },
  { id: "6", title: "Market Analysis: Q2 2024", author: "Admin", category: "Market Insights", status: "scheduled", date: "2024-06-20", views: 0 },
  { id: "7", title: "Getting Started with AI Credit Trading", author: "Admin", category: "Tutorials", status: "published", date: "2024-06-08", views: 3400 },
]

const statusColors: Record<string, string> = {
  published: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  draft: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
  scheduled: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
}

export default function AdminBlogPage() {
  const [search, setSearch] = useState("")

  const filtered = mockPosts.filter((post) =>
    post.title.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Blog Posts</h1>
          <p className="text-sm text-muted-foreground">
            Manage blog content and articles
          </p>
        </div>
        <Button size="sm" className="gap-1.5" render={<Link href="/admin/content/blog/new" />}>
          <Plus className="size-3.5" />
          New Post
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search posts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-8"
        />
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Views</TableHead>
              <TableHead className="w-24">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((post) => (
              <TableRow key={post.id}>
                <TableCell className="text-sm font-medium max-w-xs truncate">
                  {post.title}
                </TableCell>
                <TableCell className="text-sm">{post.category}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={cn("capitalize", statusColors[post.status])}>
                    {post.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground text-xs">{post.date}</TableCell>
                <TableCell className="text-right text-muted-foreground">
                  {post.views.toLocaleString()}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon-xs">
                      <Eye className="size-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon-xs" render={<Link href={`/admin/content/blog/${post.id}`} />}>
                      <Edit className="size-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon-xs" className="text-red-600">
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          Showing {filtered.length} of {mockPosts.length} posts
        </p>
        <Pagination>
          <PaginationContent>
            <PaginationItem><PaginationPrevious href="#" /></PaginationItem>
            <PaginationItem><PaginationLink href="#" isActive>1</PaginationLink></PaginationItem>
            <PaginationItem><PaginationNext href="#" /></PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  )
}
