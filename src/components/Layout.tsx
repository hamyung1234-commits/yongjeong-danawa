import { Outlet } from 'react-router-dom';
import Header from './Header';

export default function Layout() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Header />
      <main style={{ flex: 1, padding: '32px 0 64px' }}>
        <div className="container">
          <Outlet />
        </div>
      </main>
      <footer
        style={{
          background: 'var(--color-surface)',
          borderTop: '1px solid var(--color-border)',
          padding: '24px 0',
          textAlign: 'center',
        }}
      >
        <p
          style={{
            fontFamily: 'var(--font-cute)',
            fontSize: '0.8rem',
            color: 'var(--color-text-lighter)',
          }}
        >
          용정다나와 — 성용, 소정, 다정, 다나와 함께하는 소중한 기록
        </p>
      </footer>
    </div>
  );
}
