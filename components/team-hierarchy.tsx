import React, { useState } from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Team } from '@/types/teams';
import Link from 'next/link';

interface TeamComponentProps {
  team: Team;
  depth?: number;
}

export const TeamComponent: React.FC<TeamComponentProps> = ({ team, depth = 0 }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="ml-4">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          className="p-0 h-6 w-6"
          onClick={toggleExpand}
        >
          {isExpanded ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </Button>
        <Link href={`/teams/${team.id}`}>
          <span className="font-semibold hover:text-blue-500">{team.name}</span>
        </Link>
        <span className="text-sm text-gray-500">({team.full_path})</span>
      </div>
      {isExpanded && (
        <>
          <ul className="ml-8 mt-2 space-y-1">
            {team.members?.map((member) => (
              <li key={member.id} className="text-sm text-gray-700">
                {member.name} ({member.role})
              </li>
            ))}
          </ul>
          {team.children?.map((childTeam) => (
            <TeamComponent key={childTeam.id} team={childTeam} depth={depth + 1} />
          ))}
        </>
      )}
    </div>
  );
};