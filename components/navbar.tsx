"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "./auth-provider";
import { Button } from "./ui/button";

function Navbar() {
  const pathName = usePathname();
  const auth = useAuth();

  const isAdminPage = pathName?.includes("/admin");

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
          <Button onClick={loginGoogle}>Sign in with Google</Button>
        )}
        {auth?.currentUser && (
          <>
            <p>{auth?.currentUser?.displayName}</p>
            <Button variant="destructive" onClick={logout}>Sign out</Button>
          </>
        )}

      </div>
      <div className="flex items-center gap-4 my-2">
        {isAdminPage && (
          <Link href="/">Home</Link>
        )}
        {!isAdminPage && auth?.currentUser && auth.isAdmin ? (
          <Link href="/admin">Dasboard</Link>
        ): null}
        <Link href="/about">About</Link>
      </div>
    </>
  )
}

export default Navbar;
