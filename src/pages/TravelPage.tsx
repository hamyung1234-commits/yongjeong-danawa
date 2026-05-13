import { useState } from 'react';
import { Plus, Trash2, Plane, Car, Train, Ship, Star, MapPin, Hotel, CreditCard } from 'lucide-react';
import { useAppData } from '../context/AppContext';
import {
  TravelEntry, TransportType, PaymentType, RegionType, SatisfactionType,
} from '../types';

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

const regions: RegionType[] = ['대한민국', '동남아', '유럽', '북미', '일본', '중국', '오세아니아', '기타'];

const transports: { value: TransportType; label: string; icon: typeof Plane }[] = [
  { value: '비행기', label: '비행기', icon: Plane },
  { value: '자동차', label: '자동차', icon: Car },
  { value: '열차', label: '열차', icon: Train },
  { value: '배', label: '배', icon: Ship },
  { value: '기타', label: '기타', icon: Car },
];

const payments: PaymentType[] = ['신용카드', '현금', '계좌이체', '기타'];

const satisfactionLevels: { value: SatisfactionType; label: string; emoji: string }[] = [
  { value: '매우만족', label: '매우만족', emoji: '😍' },
  { value: '만족', label: '만족', emoji: '😊' },
  { value: '보통', label: '보통', emoji: '😐' },
  { value: '불만족', label: '불만족', emoji: '😕' },
  { value: '매우불만족', label: '매우불만족', emoji: '😞' },
];

export default function TravelPage() {
  const { data, updateData } = useAppData();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    startDate: new Date().toISOString().slice(0, 10),
    endDate: '',
    region: '대한민국' as RegionType,
    city: '',
    transport: '비행기' as TransportType,
    payment: '신용카드' as PaymentType,
    mileageUsed: 0,
    mileageRemaining: 0,
    hotel: '',
    hotelPrice: 0,
    stayDays: 1,
    satisfaction: '만족' as SatisfactionType,
    photos: [] as string[],
    note: '',
  });

  function resetForm() {
    setForm({
      startDate: new Date().toISOString().slice(0, 10),
      endDate: '',
      region: '대한민국',
      city: '',
      transport: '비행기',
      payment: '신용카드',
      mileageUsed: 0,
      mileageRemaining: 0,
      hotel: '',
      hotelPrice: 0,
      stayDays: 1,
      satisfaction: '만족',
      photos: [],
      note: '',
    });
    setEditingId(null);
    setShowForm(false);
  }

  function startEdit(entry: TravelEntry) {
    setForm({
      startDate: entry.startDate,
      endDate: entry.endDate,
      region: entry.region,
      city: entry.city,
      transport: entry.transport,
      payment: entry.payment,
      mileageUsed: entry.mileageUsed,
      mileageRemaining: entry.mileageRemaining,
      hotel: entry.hotel,
      hotelPrice: entry.hotelPrice,
      stayDays: entry.stayDays,
      satisfaction: entry.satisfaction,
      photos: entry.photos,
      note: entry.note,
    });
    setEditingId(entry.id);
    setShowForm(true);
  }

  function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          setForm((prev) => ({ ...prev, photos: [...prev.photos, ev.target!.result as string] }));
        }
      };
      reader.readAsDataURL(file);
    });
  }

  function removePhoto(index: number) {
    setForm((prev) => ({ ...prev, photos: prev.photos.filter((_, i) => i !== index) }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.city.trim()) {
      alert('도시를 입력해주세요.');
      return;
    }

    if (editingId) {
      updateData((prev) => ({
        ...prev,
        travelEntries: prev.travelEntries.map((entry) =>
          entry.id === editingId
            ? { ...entry, ...form, createdAt: new Date().toISOString() }
            : entry
        ),
      }));
    } else {
      const entry: TravelEntry = {
        id: generateId(),
        ...form,
        createdAt: new Date().toISOString(),
      };
      updateData((prev) => ({ ...prev, travelEntries: [entry, ...prev.travelEntries] }));
    }
    resetForm();
  }

  function deleteEntry(id: string) {
    if (!window.confirm('이 여행 기록을 삭제하시겠습니까?')) return;
    updateData((prev) => ({
      ...prev,
      travelEntries: prev.travelEntries.filter((e) => e.id !== id),
    }));
  }

  const sortedEntries = [...data.travelEntries].sort(
    (a, b) => b.startDate.localeCompare(a.startDate)
  );

  const inputStyle = {
    padding: '10px 14px',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-sm)',
    fontSize: '0.9rem',
    background: 'var(--color-surface)',
    color: 'var(--color-text)',
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
        <div
          style={{
            width: 44, height: 44, borderRadius: 'var(--radius-md)',
            background: 'var(--color-sky-light)', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
          }}
        >
          <Plane size={22} style={{ color: 'var(--color-sky)' }} />
        </div>
        <h2 style={{ fontFamily: 'var(--font-cute)', fontSize: '1.6rem', color: 'var(--color-text)' }}>
          우리 어디갔지?
        </h2>
        <button
          onClick={() => { resetForm(); setShowForm(!showForm); }}
          style={{
            marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6,
            padding: '10px 20px', borderRadius: 'var(--radius-xl)',
            background: 'var(--color-sky)', color: '#fff',
            fontFamily: 'var(--font-cute)', fontSize: '0.9rem',
          }}
        >
          <Plus size={16} />
          {showForm ? '닫기' : '여행 추가'}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          style={{
            background: 'var(--color-card)', borderRadius: 'var(--radius-lg)',
            padding: '24px', marginBottom: 24, border: '1px solid var(--color-border)',
            boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column', gap: 14,
          }}
        >
          {/* Dates */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: 4, color: 'var(--color-text-light)' }}>
                출발 날짜
              </label>
              <input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                style={{ ...inputStyle, width: '100%' }} required />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: 4, color: 'var(--color-text-light)' }}>
                도착 날짜
              </label>
              <input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                style={{ ...inputStyle, width: '100%' }} />
            </div>
          </div>

          {/* Region & City */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: 4, color: 'var(--color-text-light)' }}>
                지역
              </label>
              <select value={form.region} onChange={(e) => setForm({ ...form, region: e.target.value as RegionType })}
                style={{ ...inputStyle, width: '100%' }}>
                {regions.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: 4, color: 'var(--color-text-light)' }}>
                도시
              </label>
              <input type="text" placeholder="예: 도쿄, 파리, 뉴욕" value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                style={{ ...inputStyle, width: '100%' }} required />
            </div>
          </div>

          {/* Transport & Payment */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: 4, color: 'var(--color-text-light)' }}>
                교통수단
              </label>
              <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                {transports.map((t) => (
                  <button key={t.value} type="button" onClick={() => setForm({ ...form, transport: t.value })}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 3,
                      padding: '6px 12px', borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-cute)', fontSize: '0.8rem',
                      background: form.transport === t.value ? 'var(--color-sky)' : 'var(--color-bg)',
                      color: form.transport === t.value ? '#fff' : 'var(--color-text-light)',
                      border: form.transport === t.value ? '2px solid var(--color-sky)' : '2px solid var(--color-border)',
                    }}>
                    <t.icon size={12} />{t.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: 4, color: 'var(--color-text-light)' }}>
                결제 수단
              </label>
              <select value={form.payment} onChange={(e) => setForm({ ...form, payment: e.target.value as PaymentType })}
                style={{ ...inputStyle, width: '100%' }}>
                {payments.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Mileage */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: 4, color: 'var(--color-text-light)' }}>
                사용 마일리지
              </label>
              <input type="number" value={form.mileageUsed || ''} placeholder="0"
                onChange={(e) => setForm({ ...form, mileageUsed: Number(e.target.value) })}
                style={{ ...inputStyle, width: '100%' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: 4, color: 'var(--color-text-light)' }}>
                남은 마일리지
              </label>
              <input type="number" value={form.mileageRemaining || ''} placeholder="0"
                onChange={(e) => setForm({ ...form, mileageRemaining: Number(e.target.value) })}
                style={{ ...inputStyle, width: '100%' }} />
            </div>
          </div>

          {/* Hotel */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: 4, color: 'var(--color-text-light)' }}>
                호텔/숙소
              </label>
              <input type="text" placeholder="숙소 이름" value={form.hotel}
                onChange={(e) => setForm({ ...form, hotel: e.target.value })}
                style={{ ...inputStyle, width: '100%' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: 4, color: 'var(--color-text-light)' }}>
                숙박 일수
              </label>
              <input type="number" min="1" value={form.stayDays || ''} placeholder="1"
                onChange={(e) => setForm({ ...form, stayDays: Number(e.target.value) })}
                style={{ ...inputStyle, width: '100%' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: 4, color: 'var(--color-text-light)' }}>
                숙소 가격 (원)
              </label>
              <input type="number" value={form.hotelPrice || ''} placeholder="0"
                onChange={(e) => setForm({ ...form, hotelPrice: Number(e.target.value) })}
                style={{ ...inputStyle, width: '100%' }} />
            </div>
          </div>

          {/* Satisfaction */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: 4, color: 'var(--color-text-light)' }}>
              만족도
            </label>
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
              {satisfactionLevels.map((s) => (
                <button key={s.value} type="button" onClick={() => setForm({ ...form, satisfaction: s.value })}
                  style={{
                    padding: '8px 14px', borderRadius: 'var(--radius-sm)',
                    fontFamily: 'var(--font-cute)', fontSize: '0.85rem',
                    background: form.satisfaction === s.value ? 'var(--color-sky)' : 'var(--color-bg)',
                    color: form.satisfaction === s.value ? '#fff' : 'var(--color-text-light)',
                    border: form.satisfaction === s.value ? '2px solid var(--color-sky)' : '2px solid var(--color-border)',
                  }}>
                  {s.emoji} {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Photos */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: 4, color: 'var(--color-text-light)' }}>
              사진
            </label>
            <input type="file" accept="image/*" multiple onChange={handlePhotoUpload}
              style={{ ...inputStyle, width: '100%' }} />
            {form.photos.length > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: 8, marginTop: 8 }}>
                {form.photos.map((photo, i) => (
                  <div key={i} style={{ position: 'relative' }}>
                    <img src={photo} alt={`여행 사진 ${i + 1}`}
                      style={{ width: '100%', height: 80, objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />
                    <button type="button" onClick={() => removePhoto(i)}
                      style={{
                        position: 'absolute', top: 2, right: 2,
                        background: 'rgba(0,0,0,0.5)', borderRadius: '50%', width: 20, height: 20,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#fff', fontSize: '0.6rem',
                      }}>
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Note */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: 4, color: 'var(--color-text-light)' }}>
              상세 기록
            </label>
            <textarea placeholder="여행에 대한 상세한 기록을 남겨보세요" value={form.note}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
              style={{ ...inputStyle, width: '100%', minHeight: 80, resize: 'vertical' }} />
          </div>

          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <button type="button" onClick={resetForm}
              style={{ padding: '10px 20px', borderRadius: 'var(--radius-sm)', color: 'var(--color-text-light)', fontFamily: 'var(--font-cute)', fontSize: '0.9rem' }}>
              취소
            </button>
            <button type="submit"
              style={{ padding: '10px 24px', borderRadius: 'var(--radius-sm)', background: 'var(--color-sky)', color: '#fff', fontFamily: 'var(--font-cute)', fontSize: '0.95rem' }}>
              {editingId ? '수정하기' : '저장하기'}
            </button>
          </div>
        </form>
      )}

      {/* List */}
      {sortedEntries.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '64px 20px', color: 'var(--color-text-lighter)', fontFamily: 'var(--font-cute)', fontSize: '1rem' }}>
          <Plane size={32} style={{ marginBottom: 12, opacity: 0.4 }} />
          <p>가족 여행 기록을 남겨보세요!</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 16 }}>
          {sortedEntries.map((entry) => {
            const transportInfo = transports.find((t) => t.value === entry.transport);
            const TransitIcon = transportInfo?.icon || Plane;
            const satInfo = satisfactionLevels.find((s) => s.value === entry.satisfaction);

            return (
              <div key={entry.id}
                style={{
                  background: 'var(--color-card)', borderRadius: 'var(--radius-lg)',
                  overflow: 'hidden', border: '1px solid var(--color-border)',
                  boxShadow: 'var(--shadow-sm)',
                }}>
                {entry.photos.length > 0 && (
                  <img src={entry.photos[0]} alt={entry.city}
                    style={{ width: '100%', height: 180, objectFit: 'cover', display: 'block' }} />
                )}
                <div style={{ padding: '16px 20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                    <div>
                      <span style={{
                        fontSize: '0.7rem', padding: '2px 8px', borderRadius: 'var(--radius-xl)',
                        background: 'var(--color-sky-light)', color: 'var(--color-sky)',
                        fontFamily: 'var(--font-cute)',
                      }}>
                        {entry.region}
                      </span>
                      <h3 style={{ fontFamily: 'var(--font-cute)', fontSize: '1.15rem', margin: '4px 0', color: 'var(--color-text)' }}>
                        <MapPin size={14} style={{ display: 'inline', marginRight: 4, color: 'var(--color-sky)' }} />
                        {entry.city}
                      </h3>
                    </div>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <button onClick={() => startEdit(entry)}
                        style={{ fontSize: '0.75rem', padding: '4px 10px', borderRadius: 'var(--radius-sm)', color: 'var(--color-primary)', fontFamily: 'var(--font-cute)', background: 'var(--color-bg)' }}>
                        수정
                      </button>
                      <button onClick={() => deleteEntry(entry.id)} style={{ color: 'var(--color-text-lighter)', padding: 4 }}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, fontSize: '0.8rem', color: 'var(--color-text-light)', marginBottom: 8 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                      <TransitIcon size={12} /> {entry.transport}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                      <CreditCard size={12} /> {entry.payment}
                    </span>
                    {entry.hotel && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                        <Hotel size={12} /> {entry.hotel} ({entry.stayDays}박)
                      </span>
                    )}
                    <span>{satInfo?.emoji} {entry.satisfaction}</span>
                  </div>

                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-lighter)' }}>
                    {entry.startDate}
                    {entry.endDate && ` ~ ${entry.endDate}`}
                    {entry.mileageUsed > 0 && ` · 마일리지 ${entry.mileageUsed.toLocaleString()} 사용`}
                    {entry.hotelPrice > 0 && ` · 숙소 ${entry.hotelPrice.toLocaleString()}원`}
                  </div>

                  {entry.note && (
                    <p style={{ fontSize: '0.85rem', color: 'var(--color-text-light)', marginTop: 8, lineHeight: 1.5 }}>
                      {entry.note.slice(0, 100)}{entry.note.length > 100 ? '...' : ''}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
