import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

interface TeamHeaderProps {
  teamName: string
  onSave: () => Promise<void>
  isSaving: boolean
}

export function TeamHeader({ teamName, onSave, isSaving }: TeamHeaderProps) {
  return (
    <div className="flex items-center gap-4">
      <Link href="/">
        <Button variant="outline" size="icon" className="h-7 w-7">
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Back to Home</span>
        </Button>
      </Link>
      <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
        {teamName}
      </h1>
      <div className="hidden items-center gap-2 md:ml-auto md:flex">
        <Link href="/">
          <Button variant="outline" size="sm">
            Discard
          </Button>
        </Link>
        <Button size="sm" onClick={onSave} disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  )
} 