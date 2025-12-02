import { auth } from "@/lib/auth/auth";
import { redirect } from "next/navigation";
import { logout } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-8">
              <Link href="/dashboard">
                <h1 className="text-xl font-bold text-gray-900">
                  Kinternationals Estimate
                </h1>
              </Link>
              <nav className="flex gap-6">
                <Link
                  href="/dashboard"
                  className="text-gray-600 hover:text-gray-900"
                >
                  Dashboard
                </Link>
                <Link
                  href="/customers"
                  className="text-gray-600 hover:text-gray-900"
                >
                  Customers
                </Link>
                <Link
                  href="/products"
                  className="text-gray-600 hover:text-gray-900"
                >
                  Products
                </Link>
                <Link
                  href="/estimates"
                  className="text-gray-600 hover:text-gray-900"
                >
                  Estimates
                </Link>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                {session.user.name} ({session.user.role})
              </span>
              <form action={logout}>
                <Button type="submit" variant="outline" size="sm">
                  Logout
                </Button>
              </form>
            </div>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
