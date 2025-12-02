"use client";

import { updateEstimateStatus } from "@/lib/actions/estimates";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface StatusSelectorProps {
  estimateId: string;
  currentStatus: string;
}

const statusColors: Record<string, string> = {
  DRAFT: "bg-gray-100 text-gray-800",
  SENT: "bg-blue-100 text-blue-800",
  ACCEPTED: "bg-green-100 text-green-800",
  REJECTED: "bg-red-100 text-red-800",
  EXPIRED: "bg-orange-100 text-orange-800",
};

export function StatusSelector({
  estimateId,
  currentStatus,
}: StatusSelectorProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleStatusChange(newStatus: string) {
    setLoading(true);
    await updateEstimateStatus(estimateId, newStatus);
    router.refresh();
    setLoading(false);
  }

  return (
    <div className="space-y-3">
      <div>
        <p className="text-sm text-gray-500 mb-2">Current Status</p>
        <span
          className={`px-3 py-1 text-sm font-semibold rounded ${statusColors[currentStatus]}`}
        >
          {currentStatus}
        </span>
      </div>
      <div>
        <p className="text-sm text-gray-500 mb-2">Change Status</p>
        <select
          defaultValue={currentStatus}
          onChange={(e) => handleStatusChange(e.target.value)}
          disabled={loading}
          className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm disabled:opacity-50"
        >
          <option value="DRAFT">Draft</option>
          <option value="SENT">Sent</option>
          <option value="ACCEPTED">Accepted</option>
          <option value="REJECTED">Rejected</option>
          <option value="EXPIRED">Expired</option>
        </select>
      </div>
    </div>
  );
}
