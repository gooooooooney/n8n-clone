import { CredentialView } from "@/features/credentials/components/credential";
import { CredentialsErrorView, CredentialsLoadingView } from "@/features/credentials/components/credentials";
import { prefetchCredential } from "@/features/credentials/server/prefetch";
import { requireAuth } from "@/lib/auth-utils";
import { HydrateClient } from "@/trpc/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";


// http://localhost:3000/credentials/123
const Page = async ({ params }: PageProps<"/credentials/[credentialId]">) => {
  await requireAuth()

  const { credentialId } = await params;

  prefetchCredential(credentialId)
  return (
    <div className="p-4 md:px-10 md:py-6 h-full">
      <div className="mx-auto max-w-screen-md w-full flex flex-col gap-y-8 h-full">
        <HydrateClient>
          <ErrorBoundary fallback={<CredentialsErrorView />}>
            <Suspense fallback={<CredentialsLoadingView />}>
              <CredentialView credentialId={credentialId} />
            </Suspense>
          </ErrorBoundary>
        </HydrateClient>
      </div>
    </div>
  );
};

export default Page;
