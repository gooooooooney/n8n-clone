import { ExecutionView } from "@/features/executions/components/execution";
import { ExecutionsErrorView, ExecutionsLoadingView } from "@/features/executions/components/executions";
import { prefetchExecution } from "@/features/executions/server/prefetch";
import { requireAuth } from "@/lib/auth-utils";
import { HydrateClient } from "@/trpc/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";


// http://localhost:3000/executions/123
const Page = async ({ params }: PageProps<"/executions/[executionId]">) => {
  await requireAuth()

  const { executionId } = await params;
  prefetchExecution(executionId)
  return (
    <div className="p-4 md:px-10 md:py-6 h-full">
      <div className="mx-auto max-w-screen-md w-full flex flex-col gap-y-8 h-full">
        <HydrateClient>
          <ErrorBoundary fallback={<ExecutionsErrorView />}>
            <Suspense fallback={<ExecutionsLoadingView />}>
              <ExecutionView executionId={executionId} />
            </Suspense>
          </ErrorBoundary>
        </HydrateClient>
      </div>
    </div>
  );
};

export default Page;
