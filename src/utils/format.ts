export function formatDuration(minutes: number): string {
  return `${minutes} phút`;
}

export function formatViews(views: number): string {
  if (views >= 1_000_000) return `${(views / 1_000_000).toFixed(1)}M`;
  if (views >= 1_000) return `${(views / 1_000).toFixed(1)}K`;
  return `${views}`;
}

export function formatYear(dateString: string): string {
  return new Date(dateString).getFullYear().toString();
}

export function formatCurrency(amount: number, currency = "VND"): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

/** Plans are stored as a raw day count — this maps the common cases back to
 * the billing-cycle label admins actually mean ("/month", "/year"). */
export function formatBillingCycle(durationDays: number): string {
  if (durationDays >= 360) return "/year";
  if (durationDays >= 28) return "/month";
  return `/${durationDays} days`;
}

export function formatCountdown(totalSeconds: number): string {
  const total = Math.floor(Math.max(0, totalSeconds));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function formatRelativeDate(iso: string): string {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / (1000 * 60 * 60 * 24));
  if (days <= 0) return "Hôm nay";
  if (days === 1) return "1 ngày trước";
  if (days < 30) return `${days} ngày trước`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} tháng trước`;
  return `${Math.floor(months / 12)} năm trước`;
}
