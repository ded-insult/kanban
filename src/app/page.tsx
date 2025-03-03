"use client";

import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div>
      <Button onClick={() => alert(1)}>btn</Button>
    </div>
  );
}
