import { firestore } from "@/lib/firebase-server";
import { NextResponse } from "next/server";

export enum ItemAccess {
  PUBLIC = "PUBLIC",
  ADMIN = "ADMIN",
}

export type Item = {
  id: string;
  name: string;
  access: ItemAccess;
};

export async function GET() {
  try {
    if (!firestore) {
      return new NextResponse("Firestore is not initialized", { status: 500 });
    }

    const response = await firestore.collection("items").get();
    const items: Item[] = response.docs.map((doc) => doc.data() as Item);

    return NextResponse.json(items);
  } catch (error) {
    console.error("Error fetching items:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}