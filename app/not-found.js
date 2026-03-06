import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{
      minHeight: 'calc(100vh - 68px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: '40px 24px',
    }}>
      <div>
        <p style={{ fontFamily: 'Playfair Display, serif', fontSize: '6rem', color: 'var(--border-2)', fontWeight: 900, lineHeight: 1 }}>404</p>
        <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '2rem', margin: '16px 0 12px' }}>Page not found</h1>
        <p style={{ color: 'var(--text-3)', marginBottom: 32 }}>The page you&apos;re looking for doesn&apos;t exist.</p>
        <Link href="/" className="btn-primary">Back to Home</Link>
      </div>
    </div>
  );
}
