import { auth, firestore } from "@/lib/firebase-server";
import { DecodedIdToken } from "firebase-admin/auth";
import { NextResponse } from "next/server";
import defaultItems from "@/config/items.json";
import { Item, ItemAccess } from "@/types";

export async function GET(request: Request) {
  try {
    if (!firestore) {
      return new NextResponse("Firestore is not initialized", { status: 500 });
    }

    const authHeader = request.headers.get("Authorization") || '';
    const authToken = authHeader.startsWith("Bearer ") ? authHeader.substring(7) : '';
    let user: DecodedIdToken | null = null;

    if (auth && authToken) {
      try {
        user = await auth.verifyIdToken(authToken);
      } catch (error) {
        console.error(error);
      }
    }

    const isdmin = user?.role === "admin";

    const fetchItems = isdmin
      ? firestore.collection("items").get()
      : firestore.collection("items").where("access", "!=", ItemAccess.ADMIN).get();

    const response = await fetchItems;

    if (!response) {
      return new NextResponse("Failed to fetch items", { status: 500 });
    }

    const items: Item[] = response.docs.map((doc) => doc.data() as Item);

    if (items.length === 0) {
      const batch = firestore.batch();

      defaultItems.forEach((item) => {
        const docRef = firestore?.collection("items").doc(item.id);
        if (docRef) batch.set(docRef, item);
      });
      await batch.commit();

      return NextResponse.json(defaultItems);
    }

    return NextResponse.json(items);
  } catch (error) {
    console.error("Error fetching items:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
