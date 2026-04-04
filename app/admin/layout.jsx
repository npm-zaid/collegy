import AdminLayout from "../../admin-compo/AdminLayout";

export const metadata = {
  title: "Collegy Admin Panel",
  description: "Admin dashboard for Collegy education platform",
};

export default function Layout({ children }) {
  return (
    <AdminLayout>
      {children}
    </AdminLayout>
  );
}