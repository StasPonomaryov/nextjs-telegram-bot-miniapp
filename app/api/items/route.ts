import { auth, firestore } from "@/lib/firebase-server";
import { DecodedIdToken } from "firebase-admin/auth";
import { NextResponse } from "next/server";
import defaultItems from "@/config/items.json";

export enum ItemAccess {
  PUBLIC = "PUBLIC",
  ADMIN = "ADMIN",
}

export type Item = {
  id: string;
  name: string;
  access: ItemAccess;
};

export async function GET(request: Request) {
  try {
    if (!firestore) {
      return new NextResponse("Firestore is not initialized", { status: 500 });
    }

    const authToken = request.headers.get("Authorization")?.split('Bearer ')[1] || null;
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

    if (!response || response.empty) {
      return new NextResponse("Failed to fetch items", { status: 500 });
    }

    const items: Item[] = await response.docs.map((doc) => doc.data() as Item);

    if (items.length === 0) {
      const batch = firestore.batch();

      defaultItems.forEach((item) => {
        const docRef = firestore?.collection("items").doc(item.id);
        if (docRef) batch.set(docRef, item);
      });
      batch.commit();
      
      return NextResponse.json(defaultItems);
    }

    return NextResponse.json(items);
  } catch (error) {
    console.error("Error fetching items:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}