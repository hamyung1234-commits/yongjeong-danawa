import { Link, useLocation } from 'react-router-dom';
import { Utensils, Plane, Heart, Baby, Smile } from 'lucide-react';

const navItems = [
  {
    path: '/food',
    label: '오늘 뭐 먹지?',
    icon: Utensils,
    color: 'var(--color-peach)',
  },
  {
    path: '/travel',
    label: '우리 어디갔지?',
    icon: Plane,
    color: 'var(--color-sky)',
  },
  {
    path: '/dajung',
    label: '다정이 뭐하지?',
    icon: Baby,
    color: 'var(--color-rose)',
  },
  {
    path: '/dana',
    label: '다나 뭐하지?',
    icon: Smile,
    color: 'var(--color-lavender)',
  },
  {
    path: '/couple',
    label: '성용 소정 뭐하지?',
    icon: Heart,
    color: 'var(--color-mint)',
  },
];

export default function Header() {
  const location = useLocation();

  return (
    <header
      style={{
        background: 'var(--color-surface)',
        borderBottom: '1px solid var(--color-border)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}
    >
      <div className="container">
        {/* Top Title Bar */}
        <div style={{ textAlign: 'center', padding: '24px 0 8px' }}>
          <Link to="/">
            <h1
              style={{
                fontFamily: 'var(--font-title)',
                fontSize: 'clamp(1.8rem, 4vw, 2.6rem)',
                fontWeight: 700,
                color: 'var(--color-primary)',
                letterSpacing: '-0.02em',
                margin: 0,
                lineHeight: 1.2,
              }}
            >
              용정다나와
            </h1>
          </Link>
          <p
            style={{
              fontFamily: 'var(--font-cute)',
              fontSize: '0.75rem',
              color: 'var(--color-text-lighter)',
              marginTop: 2,
              letterSpacing: '0.05em',
            }}
          >
            성용, 소정, 다정, 다나와 함께
          </p>
        </div>

        {/* Navigation */}
        <nav
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 4,
            paddingBottom: 12,
            flexWrap: 'wrap',
          }}
        >
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '8px 16px',
                  borderRadius: 'var(--radius-xl)',
                  fontFamily: 'var(--font-cute)',
                  fontSize: '0.9rem',
                  background: isActive ? item.color : 'transparent',
                  color: isActive ? 'var(--color-text)' : 'var(--color-text-light)',
                  transition: 'all 0.2s',
                  textDecoration: 'none',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    (e.currentTarget as HTMLElement).style.background = `${item.color}40`;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    (e.currentTarget as HTMLElement).style.background = 'transparent';
                  }
                }}
              >
                <item.icon size={16} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
