import { useEffect } from "react"
import { useMutation, useQuery } from "@apollo/client/react"
import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowDownCircle, ArrowUpCircle } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  CREATE_TRANSACTION,
  UPDATE_TRANSACTION,
} from "@/lib/graphql/mutations/transaction"
import { LIST_CATEGORIES } from "@/lib/graphql/queries/category"
import {
  formatCurrencyInput,
  parseCurrencyInput,
  toDateInputValue,
} from "@/lib/format"
import { cn } from "@/lib/utils"
import type { Category, Transaction, TransactionType } from "@/types"

const transactionSchema = z.object({
  title: z.string().min(1, "Descrição é obrigatória"),
  amount: z.number().positive("Valor deve ser maior que zero"),
  type: z.enum(["INCOME", "EXPENSE"]),
  date: z.string().min(1, "Data é obrigatória"),
  categoryId: z.string().min(1, "Selecione uma categoria"),
})

type TransactionFormValues = z.infer<typeof transactionSchema>

interface TransactionFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  transaction?: Transaction | null
  onSuccess?: () => void
}

export function TransactionFormDialog({
  open,
  onOpenChange,
  transaction,
  onSuccess,
}: TransactionFormDialogProps) {
  const isEditing = Boolean(transaction)

  const { data: categoriesData } = useQuery<{ listCategories: Category[] }>(
    LIST_CATEGORIES,
    { skip: !open }
  )

  const [createTransaction, { loading: creating }] = useMutation(CREATE_TRANSACTION)
  const [updateTransaction, { loading: updating }] = useMutation(UPDATE_TRANSACTION)

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      title: "",
      amount: 0,
      type: "EXPENSE",
      date: toDateInputValue(new Date()),
      categoryId: "",
    },
  })

  const type = watch("type")
  const amount = watch("amount")
  const categoryId = watch("categoryId")

  useEffect(() => {
    if (!open) return

    if (transaction) {
      reset({
        title: transaction.title,
        amount: transaction.amount,
        type: transaction.type,
        date: toDateInputValue(transaction.date),
        categoryId: transaction.categoryId,
      })
    } else {
      reset({
        title: "",
        amount: 0,
        type: "EXPENSE",
        date: toDateInputValue(new Date()),
        categoryId: "",
      })
    }
  }, [open, transaction, reset])

  const onSubmit = async (values: TransactionFormValues) => {
    try {
      const dateIso = new Date(`${values.date}T12:00:00`).toISOString()

      if (isEditing && transaction) {
        await updateTransaction({
          variables: {
            id: transaction.id,
            data: {
              title: values.title,
              amount: values.amount,
              type: values.type,
              date: dateIso,
              categoryId: values.categoryId,
            },
          },
        })
        toast.success("Transação atualizada com sucesso!")
      } else {
        await createTransaction({
          variables: {
            data: {
              title: values.title,
              amount: values.amount,
              type: values.type,
              date: dateIso,
              categoryId: values.categoryId,
            },
          },
        })
        toast.success("Transação criada com sucesso!")
      }

      onOpenChange(false)
      onSuccess?.()
    } catch {
      toast.error("Não foi possível salvar a transação.")
    }
  }

  const categories = categoriesData?.listCategories ?? []
  const loading = creating || updating

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar transação" : "Nova transação"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Atualize os dados da transação"
              : "Registre sua despesa ou receita"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {(["EXPENSE", "INCOME"] as TransactionType[]).map((option) => {
              const isExpense = option === "EXPENSE"
              const selected = type === option
              const Icon = isExpense ? ArrowDownCircle : ArrowUpCircle
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => setValue("type", option)}
                  className={cn(
                    "flex items-center justify-center gap-2 rounded-lg border p-3 text-sm font-medium transition-colors",
                    selected && isExpense && "border-danger bg-cat-red-light text-danger",
                    selected && !isExpense && "border-success bg-cat-green-light text-success",
                    !selected && "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {isExpense ? "Despesa" : "Receita"}
                </button>
              )
            })}
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Descrição</Label>
            <Input
              id="title"
              placeholder="Ex. Almoço no restaurante"
              {...register("title")}
            />
            {errors.title && (
              <p className="text-xs text-danger">{errors.title.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="date">Data</Label>
              <Input id="date" type="date" {...register("date")} />
              {errors.date && (
                <p className="text-xs text-danger">{errors.date.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Valor</Label>
              <Input
                id="amount"
                value={formatCurrencyInput(amount || 0)}
                onChange={(e) =>
                  setValue("amount", parseCurrencyInput(e.target.value), {
                    shouldValidate: true,
                  })
                }
              />
              {errors.amount && (
                <p className="text-xs text-danger">{errors.amount.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Categoria</Label>
            <Select
              value={categoryId}
              onValueChange={(value) =>
                setValue("categoryId", value, { shouldValidate: true })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.categoryId && (
              <p className="text-xs text-danger">{errors.categoryId.message}</p>
            )}
          </div>

          <DialogFooter>
            <Button type="submit" className="w-full" disabled={loading}>
              Salvar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
