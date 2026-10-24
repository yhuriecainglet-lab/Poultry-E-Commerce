// app/admin/layout.tsx
// Layout for /admin routes. /admin/login is a public route and must NOT be
// wrapped in AdminGuard, so this layout renders children directly. Protected
// pages live in the (protected) route group, which has its own guarded layout.

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}