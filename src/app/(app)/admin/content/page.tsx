"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import { Topbar } from "@/components/topbar";
import { Button } from "@/components/ui/button";
import { LibraryCard } from "@/components/library-card";
import { LibraryDetailModal } from "@/components/library-detail-modal";
import { library, getLibraryItem } from "@/lib/mock/library";

export default function ContentPage() {
  const [openItemId, setOpenItemId] = React.useState<string | null>(null);

  return (
    <>
      <Topbar
        title="Content beheer"
        subtitle={`${library.length} materialen in alle programma's`}
        action={<Button size="sm"><Plus className="size-4" /> Upload materiaal</Button>}
      />
      <div className="grid gap-4 p-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {library.map((item) => (
          <LibraryCard key={item.id} item={item} onOpen={() => setOpenItemId(item.id)} />
        ))}
      </div>

      <LibraryDetailModal
        open={!!openItemId}
        onOpenChange={(o) => !o && setOpenItemId(null)}
        item={openItemId ? getLibraryItem(openItemId) ?? null : null}
      />
    </>
  );
}
