import Link from 'next/link';
import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';

type CompanyDto = {
  id: string;
  name: string;
  country: string | null;
  industry: string | null;
  createdAt: string;
  updatedAt: string;
};

export default async function CompaniesPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value;

  if (!token) redirect('/login');

  const h = await headers();
  const host = h.get('host') ?? 'localhost:3000';
  const proto = h.get('x-forwarded-proto') ?? 'http';
  const origin = `${proto}://${host}`;

  const r = await fetch(`${origin}/api/companies`, {
    method: 'GET',
    cache: 'no-store',
    headers: {
      cookie: cookieStore.toString(),
    },
  });

  if (r.status === 401) {
    redirect('/login');
  }

  if (!r.ok) {
    const text = await r.text().catch(() => '');
    return (
      <div style={{ fontFamily: 'system-ui' }}>
        <h1 style={{ fontSize: 22, fontWeight: 800 }}>Companies</h1>
        <pre
          style={{
            marginTop: 16,
            padding: 12,
            background: '#f7f7f7',
            borderRadius: 12,
            overflowX: 'auto',
            whiteSpace: 'pre-wrap',
          }}
        >{`Failed to load companies (${r.status})
${text}`}</pre>
      </div>
    );
  }

  const json = (await r.json()) as unknown;
  const companies: CompanyDto[] = Array.isArray(json) ? (json as CompanyDto[]) : [];

  return (
    <div style={{ fontFamily: 'system-ui' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
        }}
      >
        <h1 style={{ fontSize: 22, fontWeight: 800, margin: 0 }}>Companies</h1>

        <Link
          href="/dashboard/companies/new"
          style={{
            display: 'inline-block',
            padding: '10px 14px',
            borderRadius: 10,
            background: '#111',
            color: '#fff',
            textDecoration: 'none',
            fontWeight: 700,
          }}
        >
          Create Company
        </Link>
      </div>

      <div
        style={{
          marginTop: 16,
          border: '1px solid #eee',
          borderRadius: 12,
          overflow: 'hidden',
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#fafafa' }}>
              <th style={{ textAlign: 'left', padding: 12, borderBottom: '1px solid #eee' }}>
                Name
              </th>
              <th style={{ textAlign: 'left', padding: 12, borderBottom: '1px solid #eee' }}>
                Country
              </th>
              <th style={{ textAlign: 'left', padding: 12, borderBottom: '1px solid #eee' }}>
                Industry
              </th>
              <th style={{ textAlign: 'left', padding: 12, borderBottom: '1px solid #eee' }}>
                Created At
              </th>
            </tr>
          </thead>

          <tbody>
            {companies.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ padding: 12 }}>
                  No companies found.
                </td>
              </tr>
            ) : (
              companies.map((c) => (
                <tr key={c.id}>
                  <td style={{ padding: 12, borderBottom: '1px solid #eee' }}>
                    <Link
                      href={`/dashboard/companies/${c.id}`}
                      style={{
                        color: '#2563eb',
                        fontWeight: 700,
                        textDecoration: 'none',
                      }}
                    >
                      {c.name}
                    </Link>
                  </td>
                  <td style={{ padding: 12, borderBottom: '1px solid #eee' }}>
                    {c.country ?? '-'}
                  </td>
                  <td style={{ padding: 12, borderBottom: '1px solid #eee' }}>
                    {c.industry ?? '-'}
                  </td>
                  <td style={{ padding: 12, borderBottom: '1px solid #eee' }}>
                    {new Date(c.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}