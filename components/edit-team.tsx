import { Team } from '@/types/teams';
import { useState } from "react"
import { useRouter } from "next/router"
import { useToast } from "@/hooks/use-toast"

import { TeamHeader } from '@/components/edit-team/team-header';
import { TeamDetailsCard } from '@/components/edit-team/team-details-card';
import { TeamMembersCard } from '@/components/edit-team/team-members-card';
import { ParentTeamCard } from '@/components/edit-team/parent-team-card';

interface EditTeamProps {
  team: Team
  potentialParentTeams: Team[]
}

export default function EditTeam({ team, potentialParentTeams }: EditTeamProps) {
  const { toast } = useToast()
  const router = useRouter()

  const [formData, setFormData] = useState({
    name: team.name,
    department: team.department || '',
    members: team.members || [],
    parent_id: team.parent_id
  })
  const [isSaving, setIsSaving] = useState(false)

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
        title: "Changes Saved",
        description: "Your changes have been saved successfully",
      })

      // Redirect to home page
      setIsSaving(false)
      router.push('/')
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save changes. Please try again.",
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
            {/* Header Section */}
            <TeamHeader
              teamName={team.name}
              onSave={handleSave}
              isSaving={isSaving}
            />

            {/* Main Content Grid */}
            <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-4 lg:gap-8">
              {/* Left Column */}
              <div className="grid auto-rows-max items-start gap-4 lg:col-span-3 lg:gap-8">
                <TeamDetailsCard
                  formData={formData}
                  setFormData={setFormData}
                />

                <TeamMembersCard
                  members={formData.members}
                  setFormData={setFormData}
                />
              </div>

              {/* Right Column */}
              <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
                <ParentTeamCard
                  formData={formData}
                  setFormData={setFormData}
                  potentialParentTeams={potentialParentTeams}
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
