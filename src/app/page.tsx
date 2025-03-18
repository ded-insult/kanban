import { prisma } from "@/lib/prisma";
import AuthForm from "@/modules/auth/auth-form";

export default async function Home() {
  const roles = await prisma.role.findMany();

  return (
    <div>
      <AuthForm roles={roles} />
    </div>
  );
}
