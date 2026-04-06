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
  const { isLoggedIn } = useAdmin();
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/admin/login");
    } else {
      setChecked(true);
    }
  }, [isLoggedIn, router]);

  if (!checked) {
    return null;
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
