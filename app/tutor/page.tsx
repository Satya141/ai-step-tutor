import { Suspense } from "react";
import TutorClient from "./TutorClient";

export const dynamic = "force-dynamic";

export default function TutorPage() {
  return (
    <Suspense fallback={<div className="p-6">Loading tutor...</div>}>
      <TutorClient />
    </Suspense>
  );
}
