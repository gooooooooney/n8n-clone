import { requireAuth } from "@/lib/auth-utils";

const Page = async () => {
  await requireAuth()

  return (
    <div>
      <h1>executions</h1>
    </div>
  );
};

export default Page;
