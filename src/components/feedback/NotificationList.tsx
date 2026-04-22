import Link from "next/link";
import { Card, CardHeader } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils/cn";
import type { Notification } from "@/types/appointments";
import { formatDate, formatTime } from "@/lib/formatting/date";
import { getDictionary, t as serverT } from "@/lib/i18n/server";

export async function NotificationList({
  items,
  title = "Notifications",
}: {
  items: Notification[];
  title?: string;
}) {
  const dict = await getDictionary();
  const headerTitle = title ?? serverT(dict, "patient.dashboard.recentUpdates.title", "Notifications");

  if (!items || items.length === 0) {
    return (
      <Card>
        <CardHeader title={headerTitle} description={serverT(dict, "patient.notifications.emptyTitle", "No care updates yet.")} />
        <div className="text-sm text-[var(--color-ink-700)]">
          {serverT(
            dict,
            "patient.notifications.emptyBody",
            "No care updates are available right now. Important hospital updates, appointment changes, and lab result alerts will appear here.",
          )}
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader title={headerTitle} description={serverT(dict, "patient.notifications.recentTitle", "Recent updates that keep care journeys visible.")} />
      <div className="grid gap-3">
        {items.map((item) => {
          const iconName =
            item.category === "appointment"
              ? "calendar-days"
              : item.category === "billing"
                ? "credit-card"
                : item.category === "care"
                  ? "stethoscope"
                  : "server";

          return (
            <Link
              key={item.id}
              href={item.href ?? "#"}
              className={cn(
                "flex gap-3 rounded-[0.95rem] border px-3.5 py-3 transition hover:border-[var(--color-brand-200)] hover:bg-[var(--color-surface)]",
                !item.read
                  ? "border-[var(--color-brand-100)] bg-[var(--color-brand-50)]/55"
                  : "border-[var(--color-panel-border)] bg-white",
              )}
            >
              <div className="grid h-10 w-10 place-items-center rounded-[0.8rem] bg-[var(--color-brand-50)] text-[var(--color-brand-700)]">
                <Icon name={iconName} className="h-4 w-4" aria-hidden />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <p className="font-semibold text-[var(--color-ink-950)]">{item.title}</p>
                    <p className="mt-1 text-sm leading-6 text-[var(--color-ink-600)]">{item.body}</p>
                  </div>
                  <div className="shrink-0 text-left sm:text-right">
                    <time className="text-xs font-medium text-[var(--color-ink-500)]">
                      {formatDate(item.createdAt)} / {formatTime(item.createdAt)}
                    </time>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </Card>
  );
}
