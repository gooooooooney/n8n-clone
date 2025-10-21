import { requireAuth } from "@/lib/auth-utils";

interface Workflow {
  params: Promise<{
    workflowId: string;
  }>
}

// http://localhost:3000/workflows/123
const Page = async ({ params }: Workflow) => {
  await requireAuth()

  const { workflowId } = await params;
  return (
    <div>
      <h1>Workflows {workflowId}</h1>
    </div>
  );
};

export default Page;
