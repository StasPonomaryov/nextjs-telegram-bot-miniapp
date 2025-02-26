import { auth } from "@/lib/firebase-server";
import { DecodedIdToken } from "firebase-admin/auth";
import { cookies } from "next/headers";

async function AdminPage() {
  const coockieStore = await cookies();
  const authToken = coockieStore.get("firebaseIdToken")?.value;
  
  if (!authToken || !auth) {
    return <div>You are not logged in</div>
  }

  let user: DecodedIdToken | null = null;
  try {
    user = await auth.verifyIdToken(authToken);
  } catch (error) {
    console.error(error);
  }

  if (!user) {
    return <div>You are not logged in</div>
  }

  const isdmin = user.role === "admin";

  if (!isdmin) {
    return <div>You are not admin</div>
  }

  return <div>This page is protected</div>
}

export default AdminPage;
