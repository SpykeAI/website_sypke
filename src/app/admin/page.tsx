import { redirect } from "next/navigation";

export default function AdminPage() {
  // By default, open the SMS Inbox view as requested
  redirect("/inbox");
}
