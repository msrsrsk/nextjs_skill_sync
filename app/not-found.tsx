import { Metadata } from "next";

import NotFoundContent from "@/components/ui/other/NotFoundContent";
import { generatePageMetadata } from "@/lib/metadata/page";
import { MAIN_METADATA } from "@/constants/metadata/main";

export const metadata: Metadata = generatePageMetadata({
  ...MAIN_METADATA.NOT_FOUND,
});

export default function NotFound() {
  return <NotFoundContent />;
}
