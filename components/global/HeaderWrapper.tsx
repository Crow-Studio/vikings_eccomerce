import { getCurrentSession } from "@/lib/server/session";
import Header from "../home/header/Header"; 
export default async function HeaderWrapper() {
  const { user } = await getCurrentSession();
  return <Header user={user} />;
}
