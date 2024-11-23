import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
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
import { TeamRole } from "@/types/teams"

interface AddMemberDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  newMember: {
    name: string
    email: string
    role: TeamRole
  }
  setNewMember: (fn: (prev: any) => any) => void
  onAdd: () => Promise<void>
}

export function AddMemberDialog({
  isOpen,
  onOpenChange,
  newMember,
  setNewMember,
  onAdd,
}: AddMemberDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Team Member</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="Enter member name"
              value={newMember.name}
              onChange={(e) => setNewMember(prev => ({ ...prev, name: e.target.value }))}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter member email"
              value={newMember.email}
              onChange={(e) => setNewMember(prev => ({ ...prev, email: e.target.value }))}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="role">Role</Label>
            <Select
              value={newMember.role}
              onValueChange={(value) => setNewMember(prev => ({ ...prev, role: value as TeamRole }))}
            >
              <SelectTrigger id="role">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ADMIN">Admin</SelectItem>
                <SelectItem value="MEMBER">Member</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onAdd}>Add Member</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 