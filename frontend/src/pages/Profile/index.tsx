import { useEffect } from "react"
import { useMutation, useQuery } from "@apollo/client/react"
import { zodResolver } from "@hookform/resolvers/zod"
import { LogOut, Mail, User } from "lucide-react"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { z } from "zod"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { UPDATE_PROFILE } from "@/lib/graphql/mutations/profile"
import { GET_PROFILE } from "@/lib/graphql/queries/profile"
import { getInitials } from "@/lib/format"
import { useAuthStore } from "@/stores/auth"
import type { User as UserType } from "@/types"

const profileSchema = z.object({
  name: z.string().min(1, "Name is required"),
})

type ProfileFormValues = z.infer<typeof profileSchema>

export function ProfilePage() {
  const navigate = useNavigate()
  const { user, setUser, logout } = useAuthStore()

  const { data } = useQuery<{ getProfile: UserType }>(GET_PROFILE)

  const [updateProfile, { loading }] = useMutation(UPDATE_PROFILE)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: user?.name ?? "" },
  })

  const profileUser = data?.getProfile ?? user

  useEffect(() => {
    if (profileUser?.name) {
      reset({ name: profileUser.name })
    }
  }, [profileUser?.name, reset])

  const onSubmit = async (values: ProfileFormValues) => {
    try {
      const result = await updateProfile({
        variables: { data: { name: values.name } },
      })
      const updated = result.data as { updateProfile?: UserType } | undefined
      if (updated?.updateProfile) {
        setUser(updated.updateProfile)
        toast.success("Profile updated successfully!")
      }
    } catch {
      toast.error("Could not update profile.")
    }
  }

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  return (
    <div className="flex justify-center py-8">
      <Card className="w-full max-w-md rounded-xl">
        <CardContent className="space-y-6 p-8">
          <div className="flex flex-col items-center text-center">
            <Avatar className="h-20 w-20">
              <AvatarFallback className="text-lg">
                {profileUser?.name ? getInitials(profileUser.name) : "?"}
              </AvatarFallback>
            </Avatar>
            <h1 className="mt-4 text-xl font-bold text-gray-800">
              {profileUser?.name}
            </h1>
            <p className="text-sm text-gray-500">{profileUser?.email}</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full name</Label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input id="name" className="pl-9" {...register("name")} />
              </div>
              {errors.name && (
                <p className="text-xs text-danger">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  className="pl-9"
                  value={profileUser?.email ?? ""}
                  disabled
                />
              </div>
              <p className="text-xs text-gray-500">
                Email cannot be changed
              </p>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={loading || isSubmitting}
            >
              Save changes
            </Button>
          </form>

          <Button
            variant="outline"
            className="w-full gap-2 text-danger"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
