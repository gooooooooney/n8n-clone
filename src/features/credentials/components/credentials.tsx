"use client"
import { useSuspenseCredentials, useRemoveCredential } from "../hooks/use-credentials"
import { useRouter } from "next/navigation"
import { useCredentialsParams } from "../hooks/use-credentials-params"
import { useEntitySearch } from "@/hooks/use-entity-search"
import { CredentialType, type Credential } from "@/generated/prisma"
import { formatDistanceToNow } from "date-fns"
import { EmptyView, EntityContainer, EntityHeader, EntityItem, EntityList, EntityPagination, EntitySearch, ErrorView, LoadingView } from "@/components/entity-components"
import Image from "next/image"


export const CredentialsList = () => {
  const credentials = useSuspenseCredentials()

  return (
    <EntityList
      items={credentials.data.items}
      getKey={(item) => item.id}
      renderItem={(credential) => (
        <CredentialItem credential={credential} />
      )}
      emptyView={<CredentialsEmptyView />}
    />
  )
}

export const CredentialHeader = ({ disabled }: { disabled?: boolean }) => {

  return (
    <EntityHeader
      title="Credentials"
      description="Create and Manage your Credentials"
      newButtonLabel="New credential"
      newButtonHref="/credentials/new"
      disabled={disabled}
    />
  )
}

export const CredentialsContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <EntityContainer
      header={<CredentialHeader />}
      search={<CredentialSearch />}
      pagination={<CredentialPagination />}
    >
      {children}
    </EntityContainer>
  )
}

export const CredentialSearch = () => {
  const [params, setParams] = useCredentialsParams()

  const { searchValue, onSearchChange } = useEntitySearch({ params, setParams })
  return (
    <EntitySearch
      placeholder="Search Credentials..."
      value={searchValue}
      onChange={onSearchChange}
    />
  )
}

export const CredentialPagination = () => {
  const credential = useSuspenseCredentials()
  const [params, setParams] = useCredentialsParams()

  const handlePageChange = (newPage: number) => {
    setParams({
      ...params,
      page: newPage
    })
  }
  return (
    <EntityPagination
      page={params.page}
      totalPages={credential.data.totalPages}
      disabled={credential.isFetching}
      onPageChange={handlePageChange}
    />
  )
}


export const CredentialsLoadingView = () => {
  return <LoadingView message="Loading Credentials..." />
}

export const CredentialsErrorView = () => {
  return <ErrorView message="Error loading Credentials." />
}

export const CredentialsEmptyView = () => {
  const router = useRouter()

  const handleCreate = () => {
    router.push(`/credentials/new`)
  }
  return (
    <>
      <EmptyView
        onNew={handleCreate}
        message="You haven't created any credential yet. Get started by creating your first credential." />
    </>
  )
}


const credentialLogos: Record<CredentialType, string> = {
  [CredentialType.OPENAI]: "/logos/openai.svg",
  [CredentialType.ANTHROPIC]: "/logos/anthropic.svg",
  [CredentialType.GEMINI]: "/logos/gemini.svg",
}

export const CredentialItem = ({ credential }: { credential: Omit<Credential, "value" | "userId"> }) => {
  const removeCredential = useRemoveCredential();

  const handleRemove = () => {
    return removeCredential.mutateAsync({ id: credential.id });
  }

  const logo = credentialLogos[credential.type] || credentialLogos["OPENAI"]
  return (
    <EntityItem
      title={credential.name}
      href={`/credentials/${credential.id}`}
      subtitle={
        <>
          Updated {formatDistanceToNow(credential.updatedAt, { addSuffix: true })} {" "}
          &bull; Created{" "}
          {formatDistanceToNow(credential.createdAt, { addSuffix: true })}
        </>
      }
      image={
        <div className="size-8  flex items-center justify-center">
          <Image src={logo} alt={credential.type} width={20} height={20} />
        </div>
      }
      onRemove={handleRemove}
      isRemoving={removeCredential.isPending}
    />
  )
}