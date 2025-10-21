import { AppSidebar } from '@/components/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { PropsWithChildren } from 'react';

const Layout: React.FC<PropsWithChildren> = ({children}) => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className='bg-accent/20'>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Layout;
