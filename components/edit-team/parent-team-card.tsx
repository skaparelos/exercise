import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Team } from "@/types/teams"

interface ParentTeamCardProps {
  formData: Pick<Team, 'parent_id'>
  setFormData: (fn: (prev: any) => any) => void
  potentialParentTeams: Team[]
}

export function ParentTeamCard({
  formData,
  setFormData,
  potentialParentTeams
}: ParentTeamCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Parent Team</CardTitle>
      </CardHeader>
      <CardContent>
        <Select
          value={String(formData.parent_id ?? "none")}
          onValueChange={(value) =>
            setFormData(prev => ({ ...prev, parent_id: value === "none" ? null : Number(value) }))
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select parent team" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">No Parent Team</SelectItem>
            {potentialParentTeams.map((team) => (
              <SelectItem key={team.id} value={String(team.id)}>
                {team.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  )
} 