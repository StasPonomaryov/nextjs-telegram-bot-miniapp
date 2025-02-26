'use client';

import { cn } from "@/lib/utils";
import { Item, ItemAccess } from "@/types";

function ItemElement({ item }: { item: Item }) {
  return (
    <div key={item.id} className="flex gap-2">
      <span>{item.name}</span>
      <span className={cn("text-sm text-green-500", {
        "text-red-500": item.access === ItemAccess.ADMIN,
      })}>
        {item.access}
      </span>
    </div>
  )
}

export default ItemElement;
