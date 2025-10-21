import { requireAuth } from "@/lib/auth-utils";

interface Execution {
  params: Promise<{
    executionId: string;
  }>
}

// http://localhost:3000/executions/123
const Page = async ({ params }: Execution) => {
  await requireAuth()

  const { executionId } = await params;
  return (
    <div>
      <h1>Executions {executionId}</h1>
    </div>
  );
};

export default Page;
