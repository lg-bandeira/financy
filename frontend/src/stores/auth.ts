import { create } from "zustand"
import {
  createJSONStorage,
  persist,
  type StateStorage,
} from "zustand/middleware"
import { apolloClient } from "@/lib/graphql/apollo"
import { LOGIN } from "@/lib/graphql/mutations/login"
import { REGISTER } from "@/lib/graphql/mutations/register"
import type { AuthPayload, LoginInput, RegisterInput, User } from "@/types"

const AUTH_STORAGE_KEY = "financy-auth"
const REMEMBER_KEY = "financy-auth-remember"

function shouldPersistInLocalStorage(): boolean {
  const remember = localStorage.getItem(REMEMBER_KEY)
  if (remember === "true") return true
  if (remember === "false") return false
  return localStorage.getItem(AUTH_STORAGE_KEY) !== null
}

function getActiveStorage(): Storage {
  return shouldPersistInLocalStorage() ? localStorage : sessionStorage
}

function setRememberPreference(remember: boolean) {
  localStorage.setItem(REMEMBER_KEY, remember ? "true" : "false")
}

function clearAuthFromBothStorages() {
  localStorage.removeItem(AUTH_STORAGE_KEY)
  sessionStorage.removeItem(AUTH_STORAGE_KEY)
}

const authStorage: StateStorage = {
  getItem: (name) => getActiveStorage().getItem(name),
  setItem: (name, value) => {
    const storage = getActiveStorage()
    if (storage === localStorage) {
      sessionStorage.removeItem(name)
    } else {
      localStorage.removeItem(name)
    }
    storage.setItem(name, value)
  },
  removeItem: (name) => {
    localStorage.removeItem(name)
    sessionStorage.removeItem(name)
  },
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  login: (data: LoginInput, remember?: boolean) => Promise<boolean>
  signup: (data: RegisterInput) => Promise<boolean>
  setUser: (user: User) => void
  logout: () => void
}

type AuthMutationData = {
  login?: AuthPayload
  register?: AuthPayload
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: async (loginData: LoginInput, remember = false) => {
        const { data } = await apolloClient.mutate<
          AuthMutationData,
          { data: LoginInput }
        >({
          mutation: LOGIN,
          variables: { data: loginData },
        })

        if (data?.login) {
          const { user, token } = data.login
          setRememberPreference(remember)
          if (!remember) {
            localStorage.removeItem(AUTH_STORAGE_KEY)
          } else {
            sessionStorage.removeItem(AUTH_STORAGE_KEY)
          }
          set({
            user,
            token,
            isAuthenticated: true,
          })
          return true
        }
        return false
      },
      signup: async (registerData: RegisterInput) => {
        const { data } = await apolloClient.mutate<
          AuthMutationData,
          { data: RegisterInput }
        >({
          mutation: REGISTER,
          variables: { data: registerData },
        })

        if (data?.register) {
          const { user, token } = data.register
          setRememberPreference(true)
          sessionStorage.removeItem(AUTH_STORAGE_KEY)
          set({
            user,
            token,
            isAuthenticated: true,
          })
          return true
        }
        return false
      },
      setUser: (user: User) => {
        set({ user })
      },
      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        })
        clearAuthFromBothStorages()
        localStorage.removeItem(REMEMBER_KEY)
        apolloClient.clearStore()
      },
    }),
    {
      name: AUTH_STORAGE_KEY,
      storage: createJSONStorage(() => authStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
