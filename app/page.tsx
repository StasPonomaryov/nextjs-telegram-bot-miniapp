import { cookies } from "next/headers";
import { Item } from "@/types";
import ItemElement from "@/components/item";

export default async function Home() {
  const coockieStore = await cookies();
  const authToken = coockieStore.get("firebaseIdToken")?.value;
  let items: Item[] = [];
  const response = await fetch(`${process.env.API_URL}/api/items`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${authToken}`,
    },
    cache: 'no-store'
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
          <ItemElement key={item.id} item={item} />
        ))) : (
        <div className="text-red-500">No items</div>
      )}
    </div>
  );
}
