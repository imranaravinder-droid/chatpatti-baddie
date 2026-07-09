interface Props {
  tag: string;
  color: string;
  size?: "sm" | "md";
}

export default function MoodTagBadge({ tag, color, size = "md" }: Props) {
  const sizeClasses = size === "sm" ? "px-2.5 py-0.5 text-xs" : "px-3 py-1 text-sm";

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-semibold rounded-full ${sizeClasses}`}
      style={{ backgroundColor: color + "20", color: color }}
    >
      <span
        className="w-2 h-2 rounded-full"
        style={{ backgroundColor: color }}
      />
      {tag}
    </span>
  );
}
