import { redirect } from "next/navigation";

export default function AskMRedirect() {
  redirect("/chat");
}