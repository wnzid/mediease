"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader } from "@/components/ui/Card";
import { Switch } from "@/components/ui/Switch";
import { useToast } from "@/components/providers/ToastProvider";

export function NotificationSettingsForm() {
  const { addToast } = useToast();
  const [email, setEmail] = useState(true);
  const [sms, setSms] = useState(true);
  const [push, setPush] = useState(true);
  const [reminders, setReminders] = useState(true);

  return (
    <Card>
      <CardHeader
        title="Notification preferences"
        description="Choose how appointment reminders and operational updates reach you."
      />
      <div className="grid gap-4">
        <Switch checked={email} onCheckedChange={setEmail} label="Email updates" description="Appointment confirmations and booking changes." />
        <Switch checked={sms} onCheckedChange={setSms} label="SMS reminders" description="Short reminders before upcoming visits." />
        <Switch checked={push} onCheckedChange={setPush} label="Push notifications" description="On-device prompts for activity and tasks." />
        <Switch checked={reminders} onCheckedChange={setReminders} label="Care reminders" description="Medication and follow-up prompts placeholder." />
        <Button
          variant="outline"
          onClick={() =>
            addToast({
              tone: "success",
              title: "Notification settings saved",
              description: "Preference changes were saved in the demo interface.",
            })
          }
        >
          Save notification settings
        </Button>
      </div>
    </Card>
  );
}
