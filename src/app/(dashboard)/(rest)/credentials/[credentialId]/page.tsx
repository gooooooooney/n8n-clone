import { requireAuth } from "@/lib/auth-utils";

interface Credential {
  params: Promise<{
    credentialId: string;
  }>
}

// http://localhost:3000/credentials/123
const Page = async ({ params }: Credential) => {
  await requireAuth()

  const { credentialId } = await params;
  return (
    <div>
      <h1>Credentials {credentialId}</h1>
    </div>
  );
};

export default Page;
