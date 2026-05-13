import { useState } from 'react';
import { Plus, Trash2, Heart, Camera, Calendar, Bell, BellOff, MessageCircle, Gift } from 'lucide-react';
import { useAppData } from '../context/AppContext';
import { CouplePhoto, Anniversary, AnniversaryType, PhotoComment } from '../types';

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

const anniversaryTypes: { value: AnniversaryType; label: string; emoji: string }[] = [
  { value: '결혼기념일', label: '결혼기념일', emoji: '💍' },
  { value: '첫만남', label: '첫만남', emoji: '💕' },
  { value: '생일', label: '생일', emoji: '🎂' },
  { value: '기타기념일', label: '기타', emoji: '🎉' },
];

export default function CouplePage() {
  const { data, updateData } = useAppData();
  const [activeTab, setActiveTab] = useState<'photos' | 'anniversaries'>('photos');
  const [showPhotoForm, setShowPhotoForm] = useState(false);
  const [showAnnivForm, setShowAnnivForm] = useState(false);
  const [commentingPhotoId, setCommentingPhotoId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');

  const [photoForm, setPhotoForm] = useState({
    caption: '',
    date: new Date().toISOString().slice(0, 10),
    file: null as File | null,
  });

  const [annivForm, setAnnivForm] = useState({
    type: '결혼기념일' as AnniversaryType,
    title: '',
    date: '',
    year: new Date().getFullYear(),
    phoneNumber: '',
    notifyEnabled: true,
    notifyDaysBefore: 7,
    note: '',
  });

  function resetPhotoForm() {
    setPhotoForm({ caption: '', date: new Date().toISOString().slice(0, 10), file: null });
    setShowPhotoForm(false);
  }

  function resetAnnivForm() {
    setAnnivForm({
      type: '결혼기념일',
      title: '',
      date: '',
      year: new Date().getFullYear(),
      phoneNumber: '',
      notifyEnabled: true,
      notifyDaysBefore: 7,
      note: '',
    });
    setShowAnnivForm(false);
  }

  function handlePhotoSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!photoForm.file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const photo: CouplePhoto = {
        id: generateId(),
        dataUrl: reader.result as string,
        caption: photoForm.caption.trim(),
        date: photoForm.date,
        comments: [],
        createdAt: new Date().toISOString(),
      };
      updateData((prev) => ({
        ...prev,
        coupleData: {
          ...prev.coupleData,
          photos: [photo, ...prev.coupleData.photos],
        },
      }));
      resetPhotoForm();
    };
    reader.readAsDataURL(photoForm.file);
  }

  function handleAnnivSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!annivForm.title.trim() || !annivForm.date) {
      alert('기념일 이름과 날짜를 입력해주세요.');
      return;
    }

    const anniversary: Anniversary = {
      id: generateId(),
      ...annivForm,
      createdAt: new Date().toISOString(),
    };
    updateData((prev) => ({
      ...prev,
      coupleData: {
        ...prev.coupleData,
        anniversaries: [anniversary, ...prev.coupleData.anniversaries],
      },
    }));
    resetAnnivForm();
  }

  function deletePhoto(id: string) {
    if (!window.confirm('사진을 삭제하시겠습니까?')) return;
    updateData((prev) => ({
      ...prev,
      coupleData: {
        ...prev.coupleData,
        photos: prev.coupleData.photos.filter((p) => p.id !== id),
      },
    }));
  }

  function deleteAnniversary(id: string) {
    if (!window.confirm('기념일을 삭제하시겠습니까?')) return;
    updateData((prev) => ({
      ...prev,
      coupleData: {
        ...prev.coupleData,
        anniversaries: prev.coupleData.anniversaries.filter((a) => a.id !== id),
      },
    }));
  }

  function toggleNotify(id: string) {
    updateData((prev) => ({
      ...prev,
      coupleData: {
        ...prev.coupleData,
        anniversaries: prev.coupleData.anniversaries.map((a) =>
          a.id === id ? { ...a, notifyEnabled: !a.notifyEnabled } : a
        ),
      },
    }));
  }

  function addComment(photoId: string) {
    if (!commentText.trim()) return;
    const comment: PhotoComment = {
      id: generateId(),
      text: commentText.trim(),
      date: new Date().toISOString().slice(0, 10),
      createdAt: new Date().toISOString(),
    };
    updateData((prev) => ({
      ...prev,
      coupleData: {
        ...prev.coupleData,
        photos: prev.coupleData.photos.map((p) =>
          p.id === photoId ? { ...p, comments: [...p.comments, comment] } : p
        ),
      },
    }));
    setCommentText('');
    setCommentingPhotoId(null);
  }

  function deleteComment(photoId: string, commentId: string) {
    updateData((prev) => ({
      ...prev,
      coupleData: {
        ...prev.coupleData,
        photos: prev.coupleData.photos.map((p) =>
          p.id === photoId ? { ...p, comments: p.comments.filter((c) => c.id !== commentId) } : p
        ),
      },
    }));
  }

  const sortedPhotos = [...data.coupleData.photos].sort((a, b) => b.date.localeCompare(a.date));
  const sortedAnnivs = [...data.coupleData.anniversaries].sort((a, b) => {
    const dateA = a.date || '';
    const dateB = b.date || '';
    return dateB.localeCompare(dateA);
  });

  // Check upcoming anniversaries
  const today = new Date();
  const todayMMDD = `${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  const upcomingAnnivs = data.coupleData.anniversaries.filter((a) => {
    if (!a.notifyEnabled || !a.date) return false;
    const annivDate = new Date(today.getFullYear(), parseInt(a.date.split('-')[0]) - 1, parseInt(a.date.split('-')[1]));
    const diffDays = Math.ceil((annivDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= a.notifyDaysBefore;
  });

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
            background: 'var(--color-mint-light)', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
          }}
        >
          <Heart size={22} style={{ color: 'var(--color-mint)' }} />
        </div>
        <h2 style={{ fontFamily: 'var(--font-cute)', fontSize: '1.6rem', color: 'var(--color-text)' }}>
          성용 소정 뭐하지?
        </h2>
      </div>

      {/* Upcoming Anniversaries Alert */}
      {upcomingAnnivs.length > 0 && (
        <div
          style={{
            background: 'var(--color-mint-light)', borderRadius: 'var(--radius-md)',
            padding: '14px 20px', marginBottom: 20, border: '2px solid var(--color-mint)',
            display: 'flex', alignItems: 'center', gap: 10,
          }}
        >
          <Bell size={18} style={{ color: 'var(--color-mint)' }} />
          <span style={{ fontFamily: 'var(--font-cute)', fontSize: '0.9rem', color: 'var(--color-text)' }}>
            🎉 다가오는 기념일:{' '}
            {upcomingAnnivs.map((a, i) => (
              <span key={a.id}>
                <strong>{a.title}</strong> ({a.date}){i < upcomingAnnivs.length - 1 ? ', ' : ''}
              </span>
            ))}
          </span>
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 24 }}>
        {([
          { key: 'photos', label: '사진 앨범', icon: Camera },
          { key: 'anniversaries', label: '기념일', icon: Calendar },
        ] as const).map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '10px 20px', borderRadius: 'var(--radius-md)',
              fontFamily: 'var(--font-cute)', fontSize: '0.9rem',
              background: activeTab === tab.key ? 'var(--color-mint)' : 'var(--color-bg)',
              color: activeTab === tab.key ? '#fff' : 'var(--color-text-light)',
              border: activeTab === tab.key ? '2px solid var(--color-mint)' : '2px solid transparent',
            }}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
        <button
          onClick={() => activeTab === 'photos' ? setShowPhotoForm(!showPhotoForm) : setShowAnnivForm(!showAnnivForm)}
          style={{
            marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6,
            padding: '10px 20px', borderRadius: 'var(--radius-xl)',
            background: 'var(--color-mint)', color: '#fff',
            fontFamily: 'var(--font-cute)', fontSize: '0.9rem',
          }}
        >
          <Plus size={16} />
          {activeTab === 'photos' ? '사진 추가' : '기념일 추가'}
        </button>
      </div>

      {/* Photo Upload Form */}
      {activeTab === 'photos' && showPhotoForm && (
        <form onSubmit={handlePhotoSubmit}
          style={{
            background: 'var(--color-card)', borderRadius: 'var(--radius-lg)', padding: '24px',
            marginBottom: 24, border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)',
            display: 'flex', flexDirection: 'column', gap: 14,
          }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: 4, color: 'var(--color-text-light)' }}>사진 선택</label>
            <input type="file" accept="image/*"
              onChange={(e) => setPhotoForm({ ...photoForm, file: e.target.files?.[0] || null })}
              style={{ ...inputStyle, width: '100%' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: 4, color: 'var(--color-text-light)' }}>날짜</label>
            <input type="date" value={photoForm.date}
              onChange={(e) => setPhotoForm({ ...photoForm, date: e.target.value })}
              style={{ ...inputStyle, width: '100%' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: 4, color: 'var(--color-text-light)' }}>설명</label>
            <input type="text" placeholder="사진 설명" value={photoForm.caption}
              onChange={(e) => setPhotoForm({ ...photoForm, caption: e.target.value })}
              style={{ ...inputStyle, width: '100%' }} />
          </div>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <button type="button" onClick={resetPhotoForm}
              style={{ padding: '10px 20px', borderRadius: 'var(--radius-sm)', color: 'var(--color-text-light)', fontFamily: 'var(--font-cute)' }}>
              취소
            </button>
            <button type="submit"
              style={{ padding: '10px 24px', borderRadius: 'var(--radius-sm)', background: 'var(--color-mint)', color: '#fff', fontFamily: 'var(--font-cute)', fontSize: '0.95rem' }}>
              저장하기
            </button>
          </div>
        </form>
      )}

      {/* Anniversary Form */}
      {activeTab === 'anniversaries' && showAnnivForm && (
        <form onSubmit={handleAnnivSubmit}
          style={{
            background: 'var(--color-card)', borderRadius: 'var(--radius-lg)', padding: '24px',
            marginBottom: 24, border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)',
            display: 'flex', flexDirection: 'column', gap: 14,
          }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: 4, color: 'var(--color-text-light)' }}>기념일 종류</label>
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
              {anniversaryTypes.map((at) => (
                <button key={at.value} type="button" onClick={() => setAnnivForm({ ...annivForm, type: at.value })}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 4,
                    padding: '8px 14px', borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-cute)', fontSize: '0.85rem',
                    background: annivForm.type === at.value ? 'var(--color-mint)' : 'var(--color-bg)',
                    color: annivForm.type === at.value ? '#fff' : 'var(--color-text-light)',
                    border: annivForm.type === at.value ? '2px solid var(--color-mint)' : '2px solid var(--color-border)',
                  }}>
                  {at.emoji} {at.label}
                </button>
              ))}
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: 4, color: 'var(--color-text-light)' }}>기념일 이름</label>
              <input type="text" placeholder="예: 결혼 10주년" value={annivForm.title}
                onChange={(e) => setAnnivForm({ ...annivForm, title: e.target.value })}
                style={{ ...inputStyle, width: '100%' }} required />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: 4, color: 'var(--color-text-light)' }}>날짜 (월-일)</label>
              <input type="date" value={annivForm.date}
                onChange={(e) => {
                  const d = e.target.value;
                  const mmdd = d.slice(5);
                  const yyyy = parseInt(d.slice(0, 4));
                  setAnnivForm({ ...annivForm, date: mmdd, year: yyyy });
                }}
                style={{ ...inputStyle, width: '100%' }} required />
            </div>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: 4, color: 'var(--color-text-light)' }}>알림 받을 전화번호</label>
            <input type="tel" placeholder="010-0000-0000" value={annivForm.phoneNumber}
              onChange={(e) => setAnnivForm({ ...annivForm, phoneNumber: e.target.value })}
              style={{ ...inputStyle, width: '100%' }} />
          </div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.9rem', cursor: 'pointer' }}>
              <input type="checkbox" checked={annivForm.notifyEnabled}
                onChange={(e) => setAnnivForm({ ...annivForm, notifyEnabled: e.target.checked })} />
              알림 켜기
            </label>
            {annivForm.notifyEnabled && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-light)' }}>며칠 전 알림:</span>
                <select value={annivForm.notifyDaysBefore}
                  onChange={(e) => setAnnivForm({ ...annivForm, notifyDaysBefore: Number(e.target.value) })}
                  style={{ ...inputStyle, padding: '6px 10px' }}>
                  {[1, 3, 5, 7, 14, 30].map((d) => (
                    <option key={d} value={d}>{d}일 전</option>
                  ))}
                </select>
              </div>
            )}
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: 4, color: 'var(--color-text-light)' }}>메모</label>
            <textarea placeholder="기념일에 대한 메모" value={annivForm.note}
              onChange={(e) => setAnnivForm({ ...annivForm, note: e.target.value })}
              style={{ ...inputStyle, width: '100%', minHeight: 60, resize: 'vertical' }} />
          </div>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <button type="button" onClick={resetAnnivForm}
              style={{ padding: '10px 20px', borderRadius: 'var(--radius-sm)', color: 'var(--color-text-light)', fontFamily: 'var(--font-cute)' }}>
              취소
            </button>
            <button type="submit"
              style={{ padding: '10px 24px', borderRadius: 'var(--radius-sm)', background: 'var(--color-mint)', color: '#fff', fontFamily: 'var(--font-cute)', fontSize: '0.95rem' }}>
              저장하기
            </button>
          </div>
        </form>
      )}

      {/* Photo Gallery */}
      {activeTab === 'photos' && (
        sortedPhotos.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '64px 20px', color: 'var(--color-text-lighter)', fontFamily: 'var(--font-cute)', fontSize: '1rem' }}>
            <Camera size={32} style={{ marginBottom: 12, opacity: 0.4 }} />
            <p>부부의 소중한 사진을 올려보세요!</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
            {sortedPhotos.map((photo) => (
              <div key={photo.id}
                style={{
                  background: 'var(--color-card)', borderRadius: 'var(--radius-lg)',
                  overflow: 'hidden', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)',
                }}>
                <img src={photo.dataUrl} alt={photo.caption}
                  style={{ width: '100%', height: 220, objectFit: 'cover', display: 'block' }} />
                <div style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--color-text-lighter)' }}>{photo.date}</div>
                      {photo.caption && <p style={{ fontSize: '0.9rem', margin: '4px 0 0' }}>{photo.caption}</p>}
                    </div>
                    <button onClick={() => deletePhoto(photo.id)} style={{ color: 'var(--color-text-lighter)' }}>
                      <Trash2 size={14} />
                    </button>
                  </div>

                  {/* Comments */}
                  <div style={{ marginTop: 10, borderTop: '1px solid var(--color-border)', paddingTop: 10 }}>
                    {photo.comments.map((c) => (
                      <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 0', fontSize: '0.8rem' }}>
                        <div>
                          <span style={{ color: 'var(--color-text-lighter)' }}>{c.date}</span>
                          <span style={{ marginLeft: 8 }}>{c.text}</span>
                        </div>
                        <button onClick={() => deleteComment(photo.id, c.id)} style={{ color: 'var(--color-text-lighter)' }}>
                          <Trash2 size={10} />
                        </button>
                      </div>
                    ))}
                    {commentingPhotoId === photo.id ? (
                      <div style={{ display: 'flex', gap: 4, marginTop: 6 }}>
                        <input type="text" placeholder="메모..." value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && addComment(photo.id)}
                          style={{ flex: 1, padding: '6px 10px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem' }} />
                        <button onClick={() => addComment(photo.id)}
                          style={{ padding: '6px 10px', borderRadius: 'var(--radius-sm)', background: 'var(--color-mint)', color: '#fff', fontSize: '0.8rem', fontFamily: 'var(--font-cute)' }}>
                          저장
                        </button>
                      </div>
                    ) : (
                      <button onClick={() => { setCommentingPhotoId(photo.id); setCommentText(''); }}
                        style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 6, fontSize: '0.8rem', color: 'var(--color-text-lighter)', fontFamily: 'var(--font-cute)' }}>
                        <MessageCircle size={12} /> 댓글 달기
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {/* Anniversaries List */}
      {activeTab === 'anniversaries' && (
        sortedAnnivs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '64px 20px', color: 'var(--color-text-lighter)', fontFamily: 'var(--font-cute)', fontSize: '1rem' }}>
            <Gift size={32} style={{ marginBottom: 12, opacity: 0.4 }} />
            <p>소중한 기념일을 등록해보세요!</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {sortedAnnivs.map((anniv) => {
              const typeInfo = anniversaryTypes.find((t) => t.value === anniv.type);
              return (
                <div key={anniv.id}
                  style={{
                    background: 'var(--color-card)', borderRadius: 'var(--radius-md)',
                    padding: '16px 20px', border: '1px solid var(--color-border)',
                    display: 'flex', gap: 12, alignItems: 'flex-start',
                  }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 'var(--radius-sm)',
                    background: 'var(--color-mint-light)', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    fontSize: '1.3rem',
                  }}>
                    {typeInfo?.emoji || '💝'}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <span style={{
                          fontSize: '0.7rem', padding: '2px 8px', borderRadius: 'var(--radius-xl)',
                          background: 'var(--color-mint-light)', color: 'var(--color-mint)',
                          fontFamily: 'var(--font-cute)',
                        }}>
                          {typeInfo?.label}
                        </span>
                        <span style={{ marginLeft: 8, fontWeight: 500, fontSize: '1rem' }}>
                          {anniv.title}
                        </span>
                      </div>
                      <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                        <button onClick={() => toggleNotify(anniv.id)}
                          style={{ color: anniv.notifyEnabled ? 'var(--color-mint)' : 'var(--color-text-lighter)', padding: 4 }}
                          title={anniv.notifyEnabled ? '알림 켜짐' : '알림 꺼짐'}>
                          {anniv.notifyEnabled ? <Bell size={14} /> : <BellOff size={14} />}
                        </button>
                        <button onClick={() => deleteAnniversary(anniv.id)}
                          style={{ color: 'var(--color-text-lighter)', padding: 4 }}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-light)', marginTop: 4 }}>
                      📅 {anniv.date}
                      {anniv.notifyEnabled && ` · ${anniv.notifyDaysBefore}일 전 알림`}
                      {anniv.phoneNumber && ` · ${anniv.phoneNumber}`}
                    </div>
                    {anniv.note && (
                      <p style={{ fontSize: '0.85rem', color: 'var(--color-text-light)', marginTop: 4 }}>
                        {anniv.note}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )
      )}
    </div>
  );
}
