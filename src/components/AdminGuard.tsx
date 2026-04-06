"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAdmin } from "@/context/AdminContext";
import AdminSidebar from "@/components/AdminSidebar";

export default function AdminGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoggedIn, loading } = useAdmin();
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    // Wait until loading is complete before deciding
    if (loading) return;

    if (!isLoggedIn) {
      router.push("/admin/login");
    } else {
      setChecked(true);
    }
  }, [isLoggedIn, loading, router]);

  // Show nothing while loading or checking
  if (loading || !checked) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-beige-light">
        <div className="w-8 h-8 border-4 border-beige-dark border-t-gold rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 md:ml-64 bg-beige-light min-h-screen">
        {children}
      </main>
    </div>
  );
}
