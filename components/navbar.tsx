"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "./auth-provider";
import { Button } from "./ui/button";
import { Menubar, MenubarMenu, MenubarTrigger } from "./ui/menubar";

function Navbar() {
  const pathName = usePathname();
  const auth = useAuth();

  // const isAdminPage = pathName?.includes("/admin");
  const isHomePage = pathName === "/";

  const loginGoogle = async () => {
    await auth?.loginGoogle().catch(console.error);
  }

  const logout = async () => {
    await auth?.logOut().catch(console.error);
  }

  return (
    <>
      <div className="flex justify-between items-center gap-4 my-2">
        {auth?.currentUser && auth.isAdmin && (
          <div className="text-lime-700">Admin</div>
        )}
        {!auth?.currentUser && (
          <Button variant="secondary" onClick={loginGoogle}>Sign in with Google</Button>
        )}
        {auth?.currentUser && (
          <>
            <p>{auth?.currentUser?.displayName}</p>
            <Button variant="destructive" onClick={logout}>Sign out</Button>
          </>
        )}

      </div>
      <Menubar>
        <MenubarMenu>
          {!isHomePage ? (
            <MenubarTrigger><Link href="/">Home</Link></MenubarTrigger>
          ) : null}
          {auth?.currentUser && auth.isAdmin ? (
            <MenubarTrigger><Link href="/admin">Dasboard</Link></MenubarTrigger>
          ) : null}
          {!pathName.includes('/about') ? (
            <MenubarTrigger><Link href="/about">About</Link></MenubarTrigger>
          ) : null}
        </MenubarMenu>
      </Menubar>
    </>
  )
}

export default Navbar;
