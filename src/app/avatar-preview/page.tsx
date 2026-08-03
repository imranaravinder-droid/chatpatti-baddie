"use client";

import Avatar3D from "@/components/Avatar3D";

export default function AvatarPreviewPage() {
  return (
    <div style={{ background: "#11141c", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <Avatar3D expression="neutral" size={760} />
    </div>
  );
}
