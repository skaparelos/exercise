import Link from "next/link"
import {
  ChevronLeft,
  PlusCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Team, TeamRole } from '@/types/teams';
import { useState } from "react"
import { useRouter } from "next/router"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"



export default function EditTeam({ team, potentialParentTeams }: { team: Team, potentialParentTeams: Team[] }) {
  const { toast } = useToast()
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: team.name,
    department: team.department || '',
    members: team.members || [],
    parent_id: team.parent_id
  })

  const [newMember, setNewMember] = useState({
    name: '',
    email: '',
    role: 'MEMBER' as TeamRole
  })
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const handleAddMember = async () => {
    try {
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
        throw new Error('Failed to create user')
      }

      const { data: [user] } = await userResponse.json()

      // Add user to team members
      setFormData(prev => ({
        ...prev,
        members: [...prev.members, { ...user, role: newMember.role }]
      }))

      // Reset form and close dialog
      setNewMember({ name: '', email: '', role: 'MEMBER' })
      setIsDialogOpen(false)
      toast({
        title: "Member Added",
        description: "The member has been created and added to the team",
      })
    } catch (error) {
      console.error('Error adding member:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add team member",
      })
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const response = await fetch(`/api/teams/${team.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        throw new Error('Failed to update team')
      }

      toast({
        title: "Changes Saved Successfully",
        description: "The changes have been saved successfully",
      })

      // Redirect to home after successful save
      router.push('/')
    } catch (error) {
      console.error('Error updating team:', error)
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">

        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <div className="mx-auto grid max-w-[59rem] flex-1 auto-rows-max gap-4">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="outline" size="icon" className="h-7 w-7">
                  <ChevronLeft className="h-4 w-4" />
                  <span className="sr-only">Back to Home</span>
                </Button>
              </Link>
              <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
                {team.name}
              </h1>
              <div className="hidden items-center gap-2 md:ml-auto md:flex">
                <Link href="/">
                  <Button variant="outline" size="sm">
                    Discard
                  </Button>
                </Link>
                <Button size="sm" onClick={handleSave} disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-4 lg:gap-8">
              <div className="grid auto-rows-max items-start gap-4 lg:col-span-3 lg:gap-8">
                <Card x-chunk="dashboard-07-chunk-0">
                  <CardHeader>
                    <CardTitle>Team Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-6">
                      <div className="grid gap-3">
                        <Label htmlFor="name">Name</Label>
                        <Input
                          id="name"
                          type="text"
                          className="w-full"
                          value={formData.name}
                          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        />
                      </div>
                      <div className="grid gap-3">
                        <Label htmlFor="department">Department</Label>
                        <Input
                          id="department"
                          type="text"
                          className="w-full"
                          value={formData.department}
                          onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card x-chunk="dashboard-07-chunk-1">
                  <CardHeader>
                    <CardTitle>Members</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {formData.members?.map((member) => (
                        <div key={member.id} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div>
                              <div className="font-medium">{member.name}</div>
                              <div className="text-sm text-gray-500">{member.email}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Select
                              defaultValue={member.role}
                              onValueChange={(value) => {
                                setFormData(prev => ({
                                  ...prev,
                                  members: prev.members.map(m =>
                                    m.id === member.id ? { ...m, role: value as TeamRole } : m
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
                              onClick={() => {
                                setFormData(prev => ({
                                  ...prev,
                                  members: prev.members.filter(m => m.id !== member.id)
                                }))
                              }}
                            >
                              Remove
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="justify-center border-t p-4">
                    <Button size="sm" variant="ghost" className="gap-1">
                      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                          <div className="flex items-center gap-1">
                            <PlusCircle className="h-3.5 w-3.5" />
                            Add Member
                          </div>
                        </DialogTrigger>
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
                              <Select value={newMember.role} onValueChange={(value) => setNewMember(prev => ({ ...prev, role: value as TeamRole }))}>
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
                            <Button variant="outline" type="button" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                            <Button type="button" onClick={handleAddMember}>Add Member</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </Button>
                  </CardFooter>
                </Card>
              </div>
              <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
                <Card x-chunk="dashboard-07-chunk-3">
                  <CardHeader>
                    <CardTitle>Parent Team</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-6">
                      <div className="grid gap-3">
                        <Label htmlFor="parent_id">Parent Team</Label>
                        <Select
                          value={formData.parent_id?.toString() || 'none'}
                          onValueChange={(value) => setFormData(prev => ({
                            ...prev,
                            parent_id: value === 'none' ? null : parseInt(value)
                          }))}
                        >
                          <SelectTrigger id="parent_id" aria-label="Select parent team">
                            <SelectValue placeholder="Select parent team" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">No Parent Team</SelectItem>
                            {potentialParentTeams.map((parentTeam) => (
                              <SelectItem key={parentTeam.id} value={parentTeam.id.toString()}>
                                {parentTeam.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
