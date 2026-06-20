import { useAuth } from "@/hooks/useAuth";

function UserPage() {
  const { user } = useAuth();
  return (
    <div>{user.username} || "no user"</div>
  )
}

export default UserPage;