"use client";

import { Button } from "@/components/ui/Button";
import { Card, CardHeader } from "@/components/ui/Card";
import { Select } from "@/components/ui/Select";
import { Switch } from "@/components/ui/Switch";
import { useToast } from "@/components/providers/ToastProvider";
import { useAccessibilityPreferences } from "@/components/accessibility/AccessibilityProvider";

export function AccessibilityPreferencesForm() {
  const preferences = useAccessibilityPreferences();
  const { addToast } = useToast();

  return (
    <Card>
      <CardHeader
        title="Accessibility preferences"
        description="These settings apply across the interface and persist locally for demo use."
      />
      <div className="grid gap-4">
        <Select
          label="Text size"
          value={preferences.textSize}
          onChange={(event) => preferences.updatePreference("textSize", event.target.value as typeof preferences.textSize)}
          options={[
            { label: "Default", value: "default" },
            { label: "Large", value: "large" },
            { label: "Extra large", value: "extra-large" },
          ]}
        />
        <Select
          label="Preferred language"
          value={preferences.preferredLanguage}
          onChange={(event) => preferences.updatePreference("preferredLanguage", event.target.value)}
          options={[
            { label: "English", value: "English" },
            { label: "Spanish", value: "Spanish" },
            { label: "Placeholder: more languages soon", value: "English" },
          ]}
        />
        <Switch
          checked={preferences.highContrast}
          onCheckedChange={(checked) => preferences.updatePreference("highContrast", checked)}
          label="High contrast mode"
          description="Increase contrast for stronger readability."
        />
        <Switch
          checked={preferences.reducedMotion}
          onCheckedChange={(checked) => preferences.updatePreference("reducedMotion", checked)}
          label="Reduced motion"
          description="Tone down animation and motion-heavy transitions."
        />
        <Switch
          checked={preferences.simplifiedInterface}
          onCheckedChange={(checked) => preferences.updatePreference("simplifiedInterface", checked)}
          label="Simplified interface"
          description="Prepare for lower-complexity layouts and reduced cognitive load."
        />
        <Button
          variant="outline"
          onClick={() =>
            addToast({
              tone: "success",
              title: "Preferences saved",
              description: "Accessibility settings were updated for this browser session.",
            })
          }
        >
          Save accessibility preferences
        </Button>
      </div>
    </Card>
  );
}
