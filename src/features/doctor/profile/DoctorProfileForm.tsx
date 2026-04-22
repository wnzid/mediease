"use client";

import { Button } from "@/components/ui/Button";
import { Card, CardHeader } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { useToast } from "@/components/providers/ToastProvider";
import type { Doctor } from "@/types/doctors";

export function DoctorProfileForm() {
  const { addToast } = useToast();
  const doctor = undefined as unknown as Doctor | undefined;

  return (
    <Card>
      <CardHeader
        title="Doctor profile"
        description="Keep specialties, clinic associations, languages, and patient-facing bio aligned."
      />
      <div className="grid gap-5">
        <div className="grid gap-5 md:grid-cols-2">
          <Input label="Doctor name" defaultValue={doctor?.fullName ?? ""} />
          <Input label="Specialty" defaultValue={doctor?.specialty ?? ""} />
          <Input label="Languages" defaultValue={(doctor?.languages ?? []).join(", ")} />
          <Input label="Years of experience" defaultValue={doctor ? String(doctor.yearsExperience) : ""} />
        </div>
        <Textarea label="Bio" defaultValue={doctor?.bio ?? ""} />
        <Textarea label="Care approach" defaultValue={doctor?.careApproach ?? ""} />
        <Button
          variant="outline"
          onClick={() =>
            addToast({
              tone: "success",
              title: "Doctor profile saved",
              description: "Profile changes were saved.",
            })
          }
        >
          Save profile
        </Button>
      </div>
    </Card>
  );
}
