"use client";

import { Button } from "@/components/ui/Button";
import { Card, CardHeader } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { useToast } from "@/components/providers/ToastProvider";
import type { AuthUser } from "@/types/auth";

export function PatientProfileForm() {
  const { addToast } = useToast();
  const patientUser = undefined as unknown as AuthUser | undefined;

  return (
    <Card>
      <CardHeader
        title="Patient profile"
        description="This form demonstrates how health profile updates are grouped with readability and support in mind."
      />
      <div className="grid gap-5">
        <div className="grid gap-5 md:grid-cols-2">
          <Input label="Full name" defaultValue={patientUser?.fullName ?? ""} />
          <Input label="Email address" defaultValue={patientUser?.email ?? ""} type="email" />
          <Input label="Phone number" defaultValue={patientUser?.phone ?? ""} />
          <Input label="Date of birth" defaultValue={""} type="date" />
        </div>
        <Textarea label="Conditions and care notes" defaultValue={""} />
        <div className="grid gap-5 md:grid-cols-2">
          <Input label="Emergency contact" defaultValue={""} />
          <Input label="Emergency contact phone" defaultValue={""} />
          <Input label="Insurance provider" defaultValue={""} />
          <Input label="Member ID" defaultValue={""} />
        </div>
        <Button
          variant="outline"
          onClick={() =>
            addToast({
              tone: "success",
              title: "Profile saved",
              description: "Patient profile changes were saved.",
            })
          }
        >
          Save profile
        </Button>
      </div>
    </Card>
  );
}
