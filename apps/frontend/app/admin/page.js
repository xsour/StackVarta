import AdminApp from '../../components/admin/AdminApp';

export const metadata = {
  title: 'Панель адміністрування',
  description: 'Службова зона для керування контентом.',
  robots: {
    index: false,
    follow: false
  }
};

export default function AdminPage() {
  return (
    <main className="container page admin-page">
      <AdminApp />
    </main>
  );
}
