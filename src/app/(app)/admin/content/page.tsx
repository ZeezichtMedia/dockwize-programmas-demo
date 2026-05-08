"use client";

import { Plus } from "lucide-react";
import { Topbar } from "@/components/topbar";
import { Button } from "@/components/ui/button";
import { LibraryCard } from "@/components/library-card";
import { library } from "@/lib/mock/library";

export default function ContentPage() {
  return (
    <>
      <Topbar
        title="Content beheer"
        subtitle={`${library.length} materialen in alle programma's`}
        action={<Button size="sm"><Plus className="size-4" /> Upload materiaal</Button>}
      />
      <div className="grid gap-4 p-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {library.map((item) => (
          <LibraryCard key={item.id} item={item} />
        ))}
      </div>
    </>
  );
}
