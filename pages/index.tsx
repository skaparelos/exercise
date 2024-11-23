import { Button } from "@/components/ui/button";
import { GetServerSideProps } from "next";
import { getAllUsers } from "@/lib/services/userService";
import { User } from "@/types/users";

interface HomeProps {
  users: User[];
}

export default function Home({ users }: HomeProps) {
  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center`}
    >
      <h1 className="text-2xl font-bold mb-4">Users</h1>
      <div className="space-y-2">
        {users.map((user) => (
          <div key={user.id} className="p-4 border rounded">
            <p>{user.name}</p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        ))}
      </div>
      <Button className="mt-4">Add User</Button>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const users = await getAllUsers();

  return {
    props: {
      users,
    },
  };
};
