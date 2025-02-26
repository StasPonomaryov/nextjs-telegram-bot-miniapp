import { Item, ItemAccess } from "./api/items/route";
import { cn } from "@/lib/utils";

export default async function Home() {
  let items: Item[] = [];
  const response = await fetch(`${process.env.API_URL}/api/items`);

  if (response.ok) {
    const itemsJson = await response.json();
    
    if (itemsJson?.length > 0) items = itemsJson;
  }

  // if (!items.length) return (
  //   <div className="text-red-500">No items</div>
  // )

  return (
    <div className="page home">
      <h2>Home</h2>
      {items.map((item) => (
        <div key={item.id} className="flex gap-2">
          <span>{item.name}</span>
          <span className={cn("text-sm text-green-500", {
            "text-red-500": item.access === ItemAccess.ADMIN,
          })}>
            {item.access}
          </span>
        </div>
      ))}
    </div>
  );
}
