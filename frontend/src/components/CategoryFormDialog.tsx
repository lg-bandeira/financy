import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  CATEGORY_COLOR_HEX,
  CATEGORY_COLOR_OPTIONS,
  CATEGORY_ICON_OPTIONS,
  getCategoryIcon,
} from "@/lib/format"
import {
  CREATE_CATEGORY,
  UPDATE_CATEGORY,
} from "@/lib/graphql/mutations/category"
import { cn } from "@/lib/utils"
import type { Category, CategoryColor } from "@/types"
import { useMutation } from "@apollo/client/react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

const categorySchema = z.object({
  name: z.string().min(1, "Título é obrigatório"),
  description: z.string().optional(),
  icon: z.string().min(1, "Selecione um ícone"),
  color: z.enum([
    "green",
    "blue",
    "purple",
    "pink",
    "red",
    "orange",
    "yellow",
  ]),
})

type CategoryFormValues = z.infer<typeof categorySchema>

interface CategoryFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  category?: Category | null
  onSuccess?: () => void
}

export function CategoryFormDialog({
  open,
  onOpenChange,
  category,
  onSuccess,
}: CategoryFormDialogProps) {
  const isEditing = Boolean(category)

  const [createCategory, { loading: creating }] = useMutation(CREATE_CATEGORY)
  const [updateCategory, { loading: updating }] = useMutation(UPDATE_CATEGORY)

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      description: "",
      icon: "Briefcase",
      color: "green",
    },
  })

  const selectedIcon = watch("icon")
  const selectedColor = watch("color")

  useEffect(() => {
    if (!open) return

    if (category) {
      reset({
        name: category.name,
        description: category.description ?? "",
        icon: category.icon,
        color: category.color,
      })
    } else {
      reset({
        name: "",
        description: "",
        icon: "Briefcase",
        color: "green",
      })
    }
  }, [open, category, reset])

  const onSubmit = async (values: CategoryFormValues) => {
    try {
      if (isEditing && category) {
        await updateCategory({
          variables: {
            id: category.id,
            data: {
              name: values.name,
              description: values.description || undefined,
              icon: values.icon,
              color: values.color,
            },
          },
        })
        toast.success("Categoria atualizada com sucesso!")
      } else {
        await createCategory({
          variables: {
            data: {
              name: values.name,
              description: values.description || undefined,
              icon: values.icon,
              color: values.color,
            },
          },
        })
        toast.success("Categoria criada com sucesso!")
      }

      onOpenChange(false)
      onSuccess?.()
    } catch {
      toast.error("Não foi possível salvar a categoria.")
    }
  }

  const loading = creating || updating

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "gap-0 overflow-hidden border-gray-200 p-0 sm:max-w-[480px]",
          "[&>button]:right-5 [&>button]:top-5 [&>button]:flex [&>button]:h-8 [&>button]:w-8",
          "[&>button]:items-center [&>button]:justify-center [&>button]:rounded-md",
          "[&>button]:border [&>button]:border-gray-200 [&>button]:bg-white",
          "[&>button]:opacity-100 [&>button]:shadow-none",
          "hover:[&>button]:bg-gray-50"
        )}
      >
        <DialogHeader className="space-y-1.5 px-6 pb-0 pt-6 pr-14">
          <DialogTitle className="text-xl font-bold text-gray-800">
            {isEditing ? "Editar categoria" : "Nova categoria"}
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            {isEditing
              ? "Atualize os dados da categoria"
              : "Organize suas transações com categorias"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 px-6 pb-6 pt-5">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-gray-800">
              Título
            </Label>
            <Input
              id="name"
              placeholder="Ex. Alimentação"
              className="border-gray-200"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-xs text-danger">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-gray-800">
              Descrição
            </Label>
            <Input
              id="description"
              placeholder="Descrição da categoria"
              className="border-gray-200"
              {...register("description")}
            />
            <p className="text-xs text-gray-400">Opcional</p>
          </div>

          <div className="space-y-3">
            <Label className="text-gray-800">Ícone</Label>
            <div className="grid grid-cols-8 gap-2">
              {CATEGORY_ICON_OPTIONS.map((iconName) => {
                const Icon = getCategoryIcon(iconName)
                const selected = selectedIcon === iconName
                return (
                  <button
                    key={iconName}
                    type="button"
                    onClick={() =>
                      setValue("icon", iconName, { shouldValidate: true })
                    }
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-lg border bg-white transition-colors",
                      selected
                        ? "border-2 border-brand-base text-gray-700"
                        : "border-gray-200 text-gray-500 hover:border-gray-300"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </button>
                )
              })}
            </div>
            {errors.icon && (
              <p className="text-xs text-danger">{errors.icon.message}</p>
            )}
          </div>

          <div className="space-y-3">
            <Label className="text-gray-800">Cor</Label>
            <div className="flex flex-wrap gap-2">
              {CATEGORY_COLOR_OPTIONS.map((color) => {
                const selected = selectedColor === color
                return (
                  <button
                    key={color}
                    type="button"
                    onClick={() =>
                      setValue("color", color as CategoryColor, {
                        shouldValidate: true,
                      })
                    }
                    className={cn(
                      "h-9 w-9 rounded-full border-2 transition-colors",
                      selected ? "border-brand-base" : "border-gray-200"
                    )}
                    style={{ backgroundColor: CATEGORY_COLOR_HEX[color] }}
                    title={color}
                  />
                )
              })}
            </div>
          </div>

          <Button
            type="submit"
            className="h-11 w-full rounded-lg text-base font-semibold"
            disabled={loading}
          >
            Salvar
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
