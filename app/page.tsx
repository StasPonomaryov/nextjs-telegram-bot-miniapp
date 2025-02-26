import { cookies } from "next/headers";
import { Item, ItemAccess } from "./api/items/route";
import { cn } from "@/lib/utils";

export default async function Home() {
  const coockieStore = await cookies();
  const authToken = coockieStore.get("firebaseIdToken")?.value;
  let items: Item[] = [];
  const response = await fetch(`${process.env.API_URL}/api/items`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${authToken}`,
    },
  });

  if (response.ok) {
    const itemsJson = await response.json();

    if (itemsJson?.length > 0) items = itemsJson;
  }

  return (
    <div className="page home">
      <h2 className="text-xl my-2">Home</h2>
      {items?.length ? (
        items.map((item) => (
          <div key={item.id} className="flex gap-2">
            <span>{item.name}</span>
            <span className={cn("text-sm text-green-500", {
              "text-red-500": item.access === ItemAccess.ADMIN,
            })}>
              {item.access}
            </span>
          </div>
        ))) : (
        <div className="text-red-500">No items</div>
      )}
    </div>
  );
}
