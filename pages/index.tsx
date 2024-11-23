import { GetServerSideProps } from 'next';
import React from 'react';
import { Team } from '@/types/teams';
import { TeamComponent } from '@/components/team-hierarchy';
import { getTeamsWithMembers } from '@/lib/services/teamService';

interface HomePageProps {
  teams: Team[];
}

export default function Home({ teams }: HomePageProps) {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="max-w-4xl">
        <h1 className="text-2xl font-bold text-center mb-8">Teams Hierarchy</h1>
        {teams.map((team) => (
          <TeamComponent key={team.id} team={team} />
        ))}
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const rootTeams = await getTeamsWithMembers();

    return {
      props: {
        teams: rootTeams,
      },
    };
  } catch (error) {
    console.error('Error fetching teams:', error);
    return {
      props: {
        teams: [],
      },
    };
  }
};
