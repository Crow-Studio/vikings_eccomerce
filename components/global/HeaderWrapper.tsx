import { getCurrentSession } from "@/lib/server/session";
import Header from "../home/Header/Header.tsx";

export default async function HeaderWrapper() {
  const { user } = await getCurrentSession();
  return <Header user={user} />;
}
