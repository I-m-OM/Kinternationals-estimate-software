import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db";
import { formatCurrency } from "@/lib/services/pricing-service";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await auth();

  // Get counts
  const [customerCount, productCount, estimateCount, estimates] =
    await Promise.all([
      prisma.customer.count({ where: { isActive: true } }),
      prisma.product.count({ where: { isActive: true } }),
      prisma.estimate.count(),
      prisma.estimate.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          customer: true,
        },
      }),
    ]);

  // Calculate total value of all estimates
  const totalValue = await prisma.estimate.aggregate({
    _sum: {
      total: true,
    },
  });

  const statusColors: Record<string, string> = {
    DRAFT: "bg-gray-100 text-gray-800",
    SENT: "bg-blue-100 text-blue-800",
    ACCEPTED: "bg-green-100 text-green-800",
    REJECTED: "bg-red-100 text-red-800",
    EXPIRED: "bg-orange-100 text-orange-800",
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-900">
        Welcome back, {session?.user.name}!
      </h2>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Link href="/estimates">
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer">
            <h3 className="text-lg font-semibold text-gray-700">
              Total Estimates
            </h3>
            <p className="text-3xl font-bold text-blue-600 mt-2">
              {estimateCount}
            </p>
          </div>
        </Link>

        <Link href="/customers">
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer">
            <h3 className="text-lg font-semibold text-gray-700">
              Total Customers
            </h3>
            <p className="text-3xl font-bold text-green-600 mt-2">
              {customerCount}
            </p>
          </div>
        </Link>

        <Link href="/products">
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer">
            <h3 className="text-lg font-semibold text-gray-700">
              Total Products
            </h3>
            <p className="text-3xl font-bold text-purple-600 mt-2">
              {productCount}
            </p>
          </div>
        </Link>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Total Value</h3>
          <p className="text-3xl font-bold text-indigo-600 mt-2">
            {formatCurrency(Number(totalValue._sum.total || 0))}
          </p>
        </div>
      </div>

      {/* Recent Estimates */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-gray-900">
              Recent Estimates
            </h3>
            <Link
              href="/estimates"
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              View All →
            </Link>
          </div>
        </div>
        <div className="p-6">
          {estimates.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No estimates yet</p>
          ) : (
            <div className="space-y-3">
              {estimates.map((estimate) => (
                <Link key={estimate.id} href={`/estimates/${estimate.id}`}>
                  <div className="flex justify-between items-center p-4 bg-gray-50 rounded hover:bg-gray-100 transition-colors">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">
                        {estimate.title}
                      </p>
                      <p className="text-sm text-gray-500">
                        {estimate.customer.name}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded ${
                          statusColors[estimate.status]
                        }`}
                      >
                        {estimate.status}
                      </span>
                      <p className="font-medium text-gray-900">
                        {formatCurrency(Number(estimate.total))}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
