import React from "react";
import { AlertCircle } from "lucide-react";

export function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="flex items-center gap-2 rounded-xl bg-rose-50 border border-rose-100 px-4 py-3 text-[13px] text-rose-600 font-medium">
      <AlertCircle size={15} />
      {message}
    </div>
  )
}
