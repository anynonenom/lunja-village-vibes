import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/lunja-map")({
  beforeLoad: () => {
    throw redirect({ to: "/" });
  },
  component: () => null,
});
