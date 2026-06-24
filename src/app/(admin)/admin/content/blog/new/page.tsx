import { BlogEditor } from "@/components/admin/blog-editor"

export default function NewBlogPostPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">New Blog Post</h1>
        <p className="text-sm text-muted-foreground">
          Create a new blog post or article
        </p>
      </div>
      <BlogEditor />
    </div>
  )
}
