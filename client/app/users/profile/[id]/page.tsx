"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function LegacyAuthorProfileRedirectPage() {
  const params = useParams();
  const router = useRouter();

  useEffect(() => {
    const id = encodeURIComponent(String(params.id || "").trim());
    if (!id) {
      router.replace("/users/profile");
      return;
    }

    router.replace(`/users/auther/${id}`);
  }, [params.id, router]);

  return null;
}
