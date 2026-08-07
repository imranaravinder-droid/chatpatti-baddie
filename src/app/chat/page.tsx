export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import ChatClient from "./ChatClient";

export const metadata: Metadata = {
  title: "Prisha Chauhan Chat",
};

export default function ChatPage() {
  return <ChatClient />;
}
