import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Team } from "@/types/teams"

interface TeamDetailsCardProps {
  formData: Pick<Team, 'name' | 'department'>
  setFormData: (fn: (prev: any) => any) => void
}

export function TeamDetailsCard({ formData, setFormData }: TeamDetailsCardProps) {
  return (
    <Card>
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
              value={formData.department ?? ''}
              onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 