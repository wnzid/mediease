"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import CreateUserModal from "@/features/admin/CreateUserModal";

export function AdminUserActions() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-full bg-[var(--color-brand-600)] px-4 py-2 text-white"
      >
        <Icon name="badge-plus" className="w-4 h-4" aria-hidden />
        Create user
      </button>
      <CreateUserModal open={open} onClose={() => setOpen(false)} />
    </div>
  );
}

export default AdminUserActions;
