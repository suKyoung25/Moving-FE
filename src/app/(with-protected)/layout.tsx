import AuthRoleGuard from "@/components/common/guards/AuthRoleGuard";

export default function Layout({ children }: { children: React.ReactNode }) {
   return <AuthRoleGuard>{children}</AuthRoleGuard>;
}
