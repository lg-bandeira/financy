import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Eye, EyeOff, Lock, Mail, User, UserPlus } from "lucide-react"
import { useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { z } from "zod"
import logo from "@/assets/Logo.svg"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuthStore } from "@/stores/auth"

const signupSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

type SignupFormValues = z.infer<typeof signupSchema>

export function Signup() {
  const [showPassword, setShowPassword] = useState(false)
  const signup = useAuthStore((state) => state.signup)
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: { name: "", email: "", password: "" },
  })

  const onSubmit = async (values: SignupFormValues) => {
    try {
      const success = await signup(values)
      if (success) {
        toast.success("Account created successfully!")
        navigate("/")
      }
    } catch {
      toast.error("Could not create account. Please try again.")
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center gap-6 py-8">
      <img src={logo} alt="Financy" className="h-12 w-auto" />

      <Card className="w-full max-w-md rounded-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Create account</CardTitle>
          <CardDescription>
            Start managing your finances today
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full name</Label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  id="name"
                  placeholder="Your full name"
                  className="pl-9"
                  {...register("name")}
                />
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
                  placeholder="mail@example.com"
                  className="pl-9"
                  {...register("email")}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-danger">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="pl-9 pr-9"
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              <p className="text-xs text-gray-500">Minimum 8 characters</p>
              {errors.password && (
                <p className="text-xs text-danger">{errors.password.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full gap-2" disabled={isSubmitting}>
              <UserPlus className="h-4 w-4" />
              Sign up
            </Button>
          </form>

          <div className="my-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-gray-200" />
            <span className="text-sm text-gray-500">or</span>
            <div className="h-px flex-1 bg-gray-200" />
          </div>

          <p className="mb-3 text-center text-sm text-gray-500">
            Already have an account?
          </p>
          <Button variant="outline" className="w-full" asChild>
            <Link to="/login">Sign in</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
