"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardHeader } from "@/components/ui/Card";
import { LinkButton } from "@/components/ui/Button";

export function OnboardingPrompt() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any | null>(null);

  useEffect(() => {
    let mounted = true;
    async function fetchProfile() {
      try {
        const res = await fetch("/api/patient/profile");
        if (!mounted) return;
        if (!res.ok) {
          setProfile(null);
        } else {
          const data = await res.json();
          setProfile(data.patient ?? null);
        }
      } catch (e) {
        setProfile(null);
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) return null;

  const isComplete = profile && (profile.date_of_birth || (profile.conditions && profile.conditions.length > 0));
  if (isComplete) return null;

  return (
    <Card>
      <CardHeader title="Complete your medical profile" description="Help your care team by adding a few important details." />
      <div className="grid gap-3">
        <p className="text-sm text-[var(--color-ink-700)]">This secure medical profile lets doctors see your allergies, medications, and medical history before appointments.</p>
        <div className="flex items-center gap-3">
          <LinkButton href="/patient/profile/onboarding" variant="primary">Start profile</LinkButton>
          <Link href="/patient/profile/onboarding" className="text-sm text-[var(--color-ink-700)] hover:text-[var(--color-brand-700)]">Review later</Link>
        </div>
      </div>
    </Card>
  );
}
