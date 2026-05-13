import { Link } from 'react-router-dom';
import { Utensils, Plane, Baby, Smile, Heart, ArrowRight } from 'lucide-react';
import { useAppData } from '../context/AppContext';

const categories = [
  {
    path: '/food',
    label: '오늘 뭐 먹지?',
    icon: Utensils,
    color: 'var(--color-peach)',
    colorLight: 'var(--color-peach-light)',
    description: '가족의 아침·점심·저녁 메뉴 기록',
    emoji: '🍽️',
  },
  {
    path: '/travel',
    label: '우리 어디갔지?',
    icon: Plane,
    color: 'var(--color-sky)',
    colorLight: 'var(--color-sky-light)',
    description: '가족 여행과 소중한 추억',
    emoji: '✈️',
  },
  {
    path: '/dajung',
    label: '다정이 뭐하지?',
    icon: Baby,
    color: 'var(--color-rose)',
    colorLight: 'var(--color-rose-light)',
    description: '첫째 다정이의 모든 순간',
    emoji: '🌸',
  },
  {
    path: '/dana',
    label: '다나 뭐하지?',
    icon: Smile,
    color: 'var(--color-lavender)',
    colorLight: 'var(--color-lavender-light)',
    description: '둘째 다나의 모든 순간',
    emoji: '💜',
  },
  {
    path: '/couple',
    label: '성용 소정 뭐하지?',
    icon: Heart,
    color: 'var(--color-mint)',
    colorLight: 'var(--color-mint-light)',
    description: '부부만의 특별한 기록',
    emoji: '💚',
  },
];

export default function HomePage() {
  const { data } = useAppData();

  const stats = {
    food: data.foodEntries.length,
    travel: data.travelEntries.length,
    dajungPhotos: data.dajungData.photos.length,
    dajungRecords: data.dajungData.records.length,
    danaPhotos: data.danaData.photos.length,
    danaRecords: data.danaData.records.length,
    couplePhotos: data.coupleData.photos.length,
    coupleAnniversaries: data.coupleData.anniversaries.length,
  };

  return (
    <div>
      {/* Hero */}
      <div style={{ textAlign: 'center', padding: '40px 20px 48px' }}>
        <h2
          style={{
            fontFamily: 'var(--font-title)',
            fontSize: 'clamp(1.4rem, 3vw, 2rem)',
            fontWeight: 500,
            color: 'var(--color-primary)',
            marginBottom: 8,
          }}
        >
          우리 가족의 소중한 기록
        </h2>
        <p
          style={{
            fontFamily: 'var(--font-cute)',
            fontSize: '1rem',
            color: 'var(--color-text-lighter)',
            maxWidth: 480,
            margin: '0 auto',
            lineHeight: 1.7,
          }}
        >
          먹고, 여행하고, 웃고, 사랑한 모든 순간을 담아보세요
        </p>
      </div>

      {/* Category Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: 16,
          marginBottom: 48,
        }}
      >
        {categories.map((cat) => (
          <Link
            key={cat.path}
            to={cat.path}
            style={{
              background: 'var(--color-card)',
              borderRadius: 'var(--radius-lg)',
              padding: '28px 20px',
              textAlign: 'center',
              border: '2px solid var(--color-border)',
              transition: 'all 0.2s ease',
              display: 'block',
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.borderColor = cat.color;
              el.style.boxShadow = 'var(--shadow-md)';
              el.style.transform = 'translateY(-3px)';
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.borderColor = 'var(--color-border)';
              el.style.boxShadow = 'var(--shadow-sm)';
              el.style.transform = 'translateY(0)';
            }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 'var(--radius-md)',
                background: cat.colorLight,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 14px',
              }}
            >
              <cat.icon size={26} style={{ color: cat.color }} />
            </div>
            <h3
              style={{
                fontFamily: 'var(--font-cute)',
                fontSize: '1.05rem',
                color: 'var(--color-text)',
                marginBottom: 6,
              }}
            >
              {cat.label}
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--color-text-lighter)', lineHeight: 1.4 }}>
              {cat.description}
            </p>
          </Link>
        ))}
      </div>

      {/* Stats Summary */}
      <div
        style={{
          background: 'var(--color-surface)',
          borderRadius: 'var(--radius-lg)',
          padding: '28px 32px',
          border: '1px solid var(--color-border)',
          marginBottom: 16,
        }}
      >
        <h3
          style={{
            fontFamily: 'var(--font-cute)',
            fontSize: '1.1rem',
            color: 'var(--color-text)',
            marginBottom: 20,
          }}
        >
          📊 우리 가족 기록 현황
        </h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
            gap: 12,
          }}
        >
          <StatItem label="🍽️ 음식 기록" count={stats.food} />
          <StatItem label="✈️ 여행 기록" count={stats.travel} />
          <StatItem label="🌸 다정이 사진" count={stats.dajungPhotos} />
          <StatItem label="🏥 다정이 기록" count={stats.dajungRecords} />
          <StatItem label="💜 다나 사진" count={stats.danaPhotos} />
          <StatItem label="🏥 다나 기록" count={stats.danaRecords} />
          <StatItem label="💚 부부 사진" count={stats.couplePhotos} />
          <StatItem label="💝 기념일" count={stats.coupleAnniversaries} />
        </div>
      </div>
    </div>
  );
}

function StatItem({ label, count }: { label: string; count: number }) {
  return (
    <div
      style={{
        background: 'var(--color-bg)',
        borderRadius: 'var(--radius-sm)',
        padding: '12px 14px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <span style={{ fontSize: '0.85rem', color: 'var(--color-text-light)' }}>{label}</span>
      <span
        style={{
          fontFamily: 'var(--font-title)',
          fontSize: '1.1rem',
          fontWeight: 700,
          color: 'var(--color-primary)',
        }}
      >
        {count}
      </span>
    </div>
  );
}
