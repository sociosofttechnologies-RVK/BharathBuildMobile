// Placeholder for screens not yet ported. webRoute names the equivalent web file to port next.
import React from "react";
import { ScreenContainer } from "@/components/ui/ScreenContainer";
import { EmptyState } from "@/components/ui/EmptyState";
export function ComingSoon({ screen, webRoute }: { screen: string; webRoute: string }) {
  return <ScreenContainer><EmptyState title={screen} subtitle={`Not yet ported. Equivalent web route: ${webRoute}`} /></ScreenContainer>;
}
