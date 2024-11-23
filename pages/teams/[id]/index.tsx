import { GetServerSideProps } from 'next';
import React from 'react';
import { Team } from '@/types/teams';
import { getTeam, getAllTeams } from '@/lib/services/teamService';
import EditTeam from '@/components/edit-team';
interface TeamPageProps {
  team: Team;
  potentialParentTeams: Team[];
}

export default function TeamPage({ team, potentialParentTeams }: TeamPageProps) {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <EditTeam team={team} potentialParentTeams={potentialParentTeams} />
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  try {
    const teamId = parseInt(params?.id as string);
    const [team, allTeams] = await Promise.all([
      getTeam(teamId),
      getAllTeams()
    ]);

    if (!team) {
      return {
        notFound: true,
      };
    }

    const potentialParentTeams = allTeams.filter(t => t.id !== teamId);

    return {
      props: {
        team,
        potentialParentTeams,
      },
    };
  } catch (error) {
    console.error('Error fetching team:', error);
    return {
      notFound: true,
    };
  }
}; 