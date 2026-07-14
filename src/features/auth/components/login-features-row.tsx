import { HdBadgeIcon, LightningBadgeIcon, PlayBadgeIcon } from "./login-feature-icons";

const FEATURES = [
  { icon: PlayBadgeIcon, title: "Kho phim AI", subtitle: "Sáng tạo không giới hạn" },
  { icon: HdBadgeIcon, title: "Chất lượng cao", subtitle: "Xem mượt mọi thiết bị" },
  { icon: LightningBadgeIcon, title: "Cập nhật mỗi ngày", subtitle: "Nội dung luôn mới" },
];

export function LoginFeaturesRow() {
  return (
    <div className="grid grid-cols-3 gap-2 pt-2 text-center">
      {FEATURES.map(({ icon: Icon, title, subtitle }) => (
        <div key={title} className="flex flex-col items-center gap-1.5">
          <Icon width={42} height={42} />
          <p className="text-sm font-medium text-white">{title}</p>
          <p className="text-xs text-[#CCCCCC]">{subtitle}</p>
        </div>
      ))}
    </div>
  );
}
