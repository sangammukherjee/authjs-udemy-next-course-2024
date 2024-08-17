import { auth } from "@/auth";
import Logout from "@/components/logout";
import { Card, CardContent } from "@/components/ui/card";

async function UsersPage() {
  const session = await auth();

  console.log(session, "session");

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card>
        <CardContent className="flex flex-col items-center gap-5 p-6">
          <div>
            <h1 className="text-2xl font-bold mb-4">
              Name is {session?.user?.name}
            </h1>
            <p>Email is {session?.user?.email}</p>
          </div>
          <Logout />
        </CardContent>
      </Card>
    </div>
  );
}

export default UsersPage;
