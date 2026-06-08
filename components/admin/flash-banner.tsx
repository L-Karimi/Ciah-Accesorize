import { cn } from "@/lib/utils";

interface FlashBannerProps {
  message?: string;
  tone?: "success" | "error" | "warning";
}

export function FlashBanner({
  message,
  tone = "success",
}: FlashBannerProps) {
  if (!message) {
    return null;
  }

  return (
    <div
      className={cn(
        "rounded-[24px] border px-5 py-4 text-sm",
        tone === "success" && "border-emerald-200 bg-emerald-50 text-emerald-700",
        tone === "error" && "border-red-200 bg-red-50 text-red-700",
        tone === "warning" && "border-[#d6c2a6] bg-[#fff8f1] text-[#6d4a31]",
      )}
    >
      {message}
    </div>
  );
}
