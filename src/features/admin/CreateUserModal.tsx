"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/providers/ToastProvider";

const allowedRoles = ["patient", "doctor", "staff", "admin"] as const;

export function CreateUserModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { addToast } = useToast();
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<typeof allowedRoles[number]>("patient");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!email || !fullName || !password) {
      addToast({ title: "Validation error", description: "All fields are required.", tone: "warning" });
      return;
    }

    if (!email.includes("@")) {
      addToast({ title: "Validation error", description: "Enter a valid email.", tone: "warning" });
      return;
    }

    if (!allowedRoles.includes(role)) {
      addToast({ title: "Validation error", description: "Invalid role.", tone: "warning" });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, fullName, password, role }),
      });

      const data = await res.json();

      if (!res.ok) {
        addToast({ title: "Create user failed", description: data?.error ?? "Server error.", tone: "danger" });
      } else {
        addToast({ title: "User created", description: "The new user was created successfully.", tone: "success" });
        onClose();
        window.location.reload();
      }
    } catch (err) {
      addToast({ title: "Create user failed", description: "Network error.", tone: "danger" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Create user" description="Create a new account and assign a role.">
      <form onSubmit={handleSubmit} className="grid gap-4">
        <div>
          <label className="block text-sm font-medium text-[var(--color-ink-700)]">Full name</label>
          <input
            className="mt-1 w-full rounded-md border px-3 py-2"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--color-ink-700)]">Email</label>
          <input
            className="mt-1 w-full rounded-md border px-3 py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--color-ink-700)]">Temporary password</label>
          <input
            className="mt-1 w-full rounded-md border px-3 py-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--color-ink-700)]">Role</label>
          <select className="mt-1 w-full rounded-md border px-3 py-2" value={role} onChange={(e) => setRole(e.target.value as any)}>
            {allowedRoles.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-2 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded-md px-4 py-2">
            Cancel
          </button>
          <button disabled={loading} type="submit" className="rounded-md bg-[var(--color-brand-600)] px-4 py-2 text-white">
            {loading ? "Creating…" : "Create user"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default CreateUserModal;
