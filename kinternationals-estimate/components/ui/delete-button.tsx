"use client";

import { useState } from "react";
import { Button } from "./button";
import { useRouter } from "next/navigation";

interface DeleteButtonProps {
  onDelete: () => Promise<{ success?: boolean; error?: string }>;
  itemName: string;
  redirectTo?: string;
}

export function DeleteButton({
  onDelete,
  itemName,
  redirectTo,
}: DeleteButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  async function handleDelete() {
    setLoading(true);
    const result = await onDelete();

    if (result?.error) {
      alert(result.error);
      setLoading(false);
      setShowConfirm(false);
    } else {
      if (redirectTo) {
        router.push(redirectTo);
      }
      router.refresh();
    }
  }

  if (!showConfirm) {
    return (
      <Button
        type="button"
        variant="outline"
        onClick={() => setShowConfirm(true)}
        className="text-red-600 border-red-300 hover:bg-red-50"
      >
        Delete
      </Button>
    );
  }

  return (
    <div className="flex gap-2 items-center">
      <span className="text-sm text-gray-600">Delete {itemName}?</span>
      <Button
        type="button"
        onClick={handleDelete}
        disabled={loading}
        className="bg-red-600 hover:bg-red-700"
        size="sm"
      >
        {loading ? "Deleting..." : "Confirm"}
      </Button>
      <Button
        type="button"
        variant="outline"
        onClick={() => setShowConfirm(false)}
        size="sm"
      >
        Cancel
      </Button>
    </div>
  );
}
