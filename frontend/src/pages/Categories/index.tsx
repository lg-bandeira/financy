import { useEffect, useState } from "react"
import { useMutation, useQuery } from "@apollo/client/react"
import { ArrowUpDown, Pencil, Plus, Tag, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { CategoryFormDialog } from "@/components/CategoryFormDialog"
import { CategoryTag } from "@/components/CategoryTag"
import { SummaryCard } from "@/components/SummaryCard"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { DELETE_CATEGORY } from "@/lib/graphql/mutations/category"
import {
  GET_CATEGORY_STATS,
  LIST_CATEGORIES,
} from "@/lib/graphql/queries/category"
import {
  getCategoryColorClasses,
  getCategoryIcon,
} from "@/lib/format"
import { cn } from "@/lib/utils"
import type { Category, CategoryStats } from "@/types"

export function CategoriesPage() {
  const [formOpen, setFormOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null)

  const { data: categoriesData, refetch: refetchCategories } = useQuery<{
    listCategories: Category[]
  }>(LIST_CATEGORIES)

  const { data: statsData, refetch: refetchStats } = useQuery<{
    getCategoryStats: CategoryStats
  }>(GET_CATEGORY_STATS)

  const refetchAll = () => {
    void refetchCategories()
    void refetchStats()
  }

  useEffect(() => {
    refetchAll()
  }, [refetchCategories, refetchStats])

  const [deleteCategory, { loading: deleting }] = useMutation(DELETE_CATEGORY)

  const categories = categoriesData?.listCategories ?? []
  const stats = statsData?.getCategoryStats
  const mostUsed = stats?.mostUsedCategory
  const MostUsedIcon = mostUsed ? getCategoryIcon(mostUsed.icon) : Tag

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      await deleteCategory({ variables: { id: deleteTarget.id } })
      toast.success("Category deleted successfully!")
      setDeleteTarget(null)
      refetchAll()
    } catch {
      toast.error("Could not delete the category.")
    }
  }

  const openCreate = () => {
    setEditingCategory(null)
    setFormOpen(true)
  }

  const openEdit = (category: Category) => {
    setEditingCategory(category)
    setFormOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Categories</h1>
          <p className="mt-1 text-sm text-gray-500">
            Organize your transactions by category
          </p>
        </div>
        <Button className="shrink-0 gap-2" onClick={openCreate}>
          <Plus className="h-4 w-4" />
          New category
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <SummaryCard
          label="Total Categories"
          value={String(stats?.totalCategories ?? 0)}
          icon={Tag}
          iconClassName="bg-gray-100"
          iconColorClassName="text-gray-600"
          valueFirst
        />
        <SummaryCard
          label="Total Transactions"
          value={String(stats?.totalTransactions ?? 0)}
          icon={ArrowUpDown}
          iconClassName="bg-cat-purple-light"
          iconColorClassName="text-cat-purple-base"
          valueFirst
        />
        <SummaryCard
          label="Most Used Category"
          value={mostUsed?.name ?? "—"}
          icon={MostUsedIcon}
          iconClassName={
            mostUsed
              ? getCategoryColorClasses(mostUsed.color).iconBg
              : "bg-gray-100"
          }
          iconColorClassName={
            mostUsed
              ? getCategoryColorClasses(mostUsed.color).iconText
              : "text-gray-600"
          }
          valueFirst
        />
      </div>

      {categories.length ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => {
            const Icon = getCategoryIcon(category.icon)
            const colors = getCategoryColorClasses(category.color)
            const count = category.transactionCount ?? 0

            return (
              <Card
                key={category.id}
                className="border-gray-200 shadow-sm"
              >
                <CardContent className="flex h-full flex-col p-5">
                  <div className="mb-4 flex items-start justify-between gap-2">
                    <div
                      className={cn(
                        "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
                        colors.iconBg
                      )}
                    >
                      <Icon className={cn("h-5 w-5", colors.iconText)} />
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 border-gray-200 bg-white hover:bg-gray-50"
                        onClick={() => setDeleteTarget(category)}
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4 text-danger" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 border-gray-200 bg-white hover:bg-gray-50"
                        onClick={() => openEdit(category)}
                        title="Edit"
                      >
                        <Pencil className="h-4 w-4 text-gray-600" />
                      </Button>
                    </div>
                  </div>

                  <h3 className="font-semibold text-gray-800">{category.name}</h3>
                  <p className="mt-1 line-clamp-2 min-h-[2.5rem] text-sm text-gray-500">
                    {category.description || "\u00A0"}
                  </p>

                  <div className="mt-auto flex items-center justify-between gap-2 pt-4">
                    <CategoryTag name={category.name} color={category.color} />
                    <span className="shrink-0 text-sm text-gray-500">
                      {count} {count === 1 ? "item" : "items"}
                    </span>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : (
        <Card className="border-gray-200 shadow-sm">
          <CardContent className="py-12 text-center">
            <p className="mb-4 text-gray-500">No categories registered.</p>
            <Button onClick={openCreate} className="gap-2">
              <Plus className="h-4 w-4" />
              New category
            </Button>
          </CardContent>
        </Card>
      )}

      <CategoryFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        category={editingCategory}
        onSuccess={refetchAll}
      />

      <Dialog open={Boolean(deleteTarget)} onOpenChange={() => setDeleteTarget(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete category</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{deleteTarget?.name}&quot;? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
