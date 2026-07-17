import type { ReactNode } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import LoginForm from "./LoginForm"

interface LoginDialogProps {
  /** The control that opens the dialog — rendered as the trigger itself. */
  children: ReactNode
}

/**
 * Sign-in popup. Replaces the standalone /login page so visitors can log in
 * without leaving the landing page.
 */
export default function LoginDialog({ children }: LoginDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader className="text-center">
          <DialogTitle className="text-xl">Welcome back</DialogTitle>
          <DialogDescription>Log in to continue to InteliPath</DialogDescription>
        </DialogHeader>
        <LoginForm />
      </DialogContent>
    </Dialog>
  )
}
