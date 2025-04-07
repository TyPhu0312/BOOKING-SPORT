"use client"; // Ensure client-side rendering

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const AdminPage = () => {
  const router = useRouter();
  useEffect(() => {
    router.push("/admin/dashboard");
  }, [router]);
  return (
    <div className="flex justify-center items-center min-h-screen">
      <p>Redirecting...</p>
    </div>
  );
};

export default AdminPage;
