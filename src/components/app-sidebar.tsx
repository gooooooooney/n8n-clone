"use client"
import { authClient } from '@/lib/auth-client';
import { CreditCardIcon, FolderOpenIcon, HistoryIcon, KeyIcon, LogOutIcon, StarIcon } from 'lucide-react';
import Image from "next/image";
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from './ui/sidebar';

const menuItems = [
  {
    title: "Main",
    items: [
      {
        title: "Workflows",
        icon: FolderOpenIcon,
        url: "/workflows"
      },
      {
        title: "Credentials",
        icon: KeyIcon,
        url: "/credentials"
      },
      {
        title: "Executions",
        icon: HistoryIcon,
        url: "/executions"
      },
    ]
   }
]

export const AppSidebar = () => {
  const router = useRouter()
  const pathname = usePathname()

  return (
    <Sidebar collapsible='icon'>
      <SidebarHeader>
        <SidebarMenuItem>
          <SidebarMenuButton asChild className="gap-x-4 h-10 px-4">
            <Link prefetch href="/">
              <Image src="/logos/logo.svg" alt="Logo" width={30} height={30} />
              <span className="text-sm font-semibold">Nodebase</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarHeader>
      <SidebarContent>
        {
          menuItems.map(group => (
            <SidebarGroup key={group.title}>
              <SidebarGroupContent>
                <SidebarMenu>
                    {
                      group.items.map(item => (
                        <SidebarMenuItem key={item.title} >
                          <SidebarMenuButton
                            tooltip={item.title}
                            isActive={
                              item.url === "/"
                              ? pathname == "/"
                              : pathname.startsWith(item.url)
                            }
                            asChild
                            className='gap-x-4 h-10 px-4'
                          >
                            <Link href={item.url} prefetch>
                              <item.icon className='size-4'/>
                              <span className='text-sm'>{item.title}</span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))
                    }
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))
        }

      </SidebarContent>
      <SidebarFooter>
        <SidebarMenuItem>
          <SidebarMenuButton
            tooltip="Upgade to Pro"
           onClick={() => {}}
            className="gap-x-4 h-10 px-4">
            <StarIcon className='size-4' />
            <span className='text-sm'>Upgrade to Pro</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton
            tooltip="Billing Portal"
           onClick={() => {}}
            className="gap-x-4 h-10 px-4">
            <CreditCardIcon className='size-4' />
            <span className='text-sm'>Billing Portal</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton
            tooltip="Sign out"
           onClick={() => {
             authClient.signOut({
               fetchOptions: {
                 onSuccess() {
                   router.push('/login');
                 }
               }
             })
           }}
            className="gap-x-4 h-10 px-4">
            <LogOutIcon className='size-4' />
            <span className='text-sm'>Sign out</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarFooter>
    </Sidebar>
  );
};
