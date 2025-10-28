import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "./auth";

export const getSession = async () => {
  return auth.api.getSession({
    headers: await headers()
  })
}

export const requireAuth = async () => {
  const session = await getSession();

  if (!session) {
    redirect('/login')
  }

  return session;

};
export const requireUnAuth = async () => {
  const session = await getSession()

  if (session) {
    redirect('/')
  }

};
