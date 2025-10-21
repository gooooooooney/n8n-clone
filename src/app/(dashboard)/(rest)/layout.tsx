import { AppHeader } from "@/components/app-header"
import { PropsWithChildren } from "react"

const Layout: React.FC<PropsWithChildren> = ({children}) => {


  return (
    <>
      <AppHeader />
      <main className="flex-1">
        {children}
      </main>
    </>
  )
}

export default Layout
