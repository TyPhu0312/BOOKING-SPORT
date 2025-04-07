"use client"; // Ensure client-side rendering

import { useEffect } from "react";
import { useRouter } from "next/navigation"; // Import useRouter for redirect

const AdminPage = () => {
  const router = useRouter();

  // Redirect to /admin/dashboard when visiting /admin
  useEffect(() => {
    router.push("/admin/dashboard");
  }, [router]);

  // Return a loading state while redirecting
  return (
    <div className="flex justify-center items-center min-h-screen">
      <p>Redirecting...</p>
    </div>
  );
};

export default AdminPage;
