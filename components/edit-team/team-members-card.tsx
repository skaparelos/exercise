import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { TeamMember, TeamRole } from "@/types/teams"
import { AddMemberDialog } from "./add-member-dialog"
import { useToast } from "@/hooks/use-toast"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface TeamMembersCardProps {
  members: TeamMember[]
  setFormData: (fn: (prev: any) => any) => void
}

export function TeamMembersCard({ members, setFormData }: TeamMembersCardProps) {
  const { toast } = useToast()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newMember, setNewMember] = useState<{
    name: string
    email: string
    role: TeamRole
    is_active: boolean
  }>({
    name: "",
    email: "",
    role: "MEMBER",
    is_active: true
  })

  const handleAddMember = async () => {
    try {
      // Validation
      if (!newMember.name || !newMember.email) {
        toast({
          title: "Error",
          description: "Please fill in all required fields",
          variant: "destructive"
        })
        return
      }

      // Create user first
      const userResponse = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newMember.name,
          email: newMember.email,
        })
      })

      if (!userResponse.ok) {
        toast({
          title: "Error",
          description: "Failed to add team member",
          variant: "destructive"
        })
        setNewMember({ name: "", email: "", role: "MEMBER", is_active: true })
        setIsDialogOpen(false)
        return
      }

      const { data: [user] } = await userResponse.json()

      // Add user to team members with is_active set to true
      setFormData(prev => ({
        ...prev,
        members: [...prev.members, { ...user, role: newMember.role, is_active: true }]
      }))

      setIsDialogOpen(false)
      setNewMember({ name: "", email: "", role: "MEMBER", is_active: true })

      toast({
        title: "Success",
        description: "Team member added successfully"
      })
    } catch (error) {
      console.error('Error adding member:', error)
      toast({
        title: "Error",
        description: "Failed to add team member",
        variant: "destructive"
      })
    }
  }

  const handleRemoveMember = (email: string) => {
    setFormData(prev => ({
      ...prev,
      members: prev.members.filter((member: TeamMember) => member.email !== email)
    }))
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Team Members</CardTitle>
        <Button size="sm" onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Member
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {members.map((member) => (
            <div
              key={member.email}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div>
                  <div className="font-medium">{member.name}</div>
                  <div className="text-sm text-gray-500">{member.email}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`active-${member.email}`}
                    checked={member.is_active ?? true}
                    onCheckedChange={(checked) => {
                      setFormData(prev => ({
                        ...prev,
                        members: prev.members.map((m: TeamMember) =>
                          m.email === member.email ? { ...m, is_active: checked } : m
                        )
                      }))
                    }}
                  />
                  <label
                    htmlFor={`active-${member.email}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Active
                  </label>
                </div>
                <Select
                  defaultValue={member.role}
                  onValueChange={(value) => {
                    setFormData(prev => ({
                      ...prev,
                      members: prev.members.map((m: TeamMember) =>
                        m.email === member.email ? { ...m, role: value as TeamRole } : m
                      )
                    }))
                  }}
                >
                  <SelectTrigger aria-label="Select role">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ADMIN">ADMIN</SelectItem>
                    <SelectItem value="MEMBER">MEMBER</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={() => handleRemoveMember(member.email)}
                >
                  Remove
                </Button>
              </div>
            </div>
          ))}
          {members.length === 0 && (
            <p className="text-center text-sm text-muted-foreground">
              No team members yet. Add some members to get started.
            </p>
          )}
        </div>
      </CardContent>

      <AddMemberDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        newMember={newMember}
        setNewMember={setNewMember}
        onAdd={handleAddMember}
      />
    </Card>
  )
} 