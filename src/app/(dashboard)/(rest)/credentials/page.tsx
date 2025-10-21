import { requireAuth } from "@/lib/auth-utils";

const Page = async () => {
  await requireAuth()

  return (
    <div>
      <h1>Credentials</h1>
    </div>
  );
};

export default Page;
