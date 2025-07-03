"use client";

import { useAuth } from "@/context/AuthContext";

export default function Page() {
  const { loginAsClient } = useAuth();
  return <div>s</div>;
}
