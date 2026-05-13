import { useState, useRef } from 'react';
import { Plus, Trash2, Camera, Stethoscope, Syringe, Shield, FileText, MessageCircle } from 'lucide-react';
import { ChildData, ChildPhoto, ChildRecord, RecordType, PhotoComment } from '../types';

const recordTypes: { value: RecordType; label: string; icon: typeof Stethoscope }[] = [
  { value: '병원치료', label: '병원 치료', icon: Stethoscope },
  { value: '예방접종', label: '예방접종', icon: Syringe },
  { value: '보험', label: '보험', icon: Shield },
  { value: '기타', label: '기타', icon: FileText },
];

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

interface ChildPageProps {
  name: string;
  icon: typeof Camera;
  iconColor: string;
  iconBg: string;
  dataKey: 'dajungData' | 'danaData';
}

export default function ChildPage({ name, icon: Icon, iconColor, iconBg, dataKey }: ChildPageProps) {
  const [data, setData] = useState<ChildData>(() => {
    const raw = localStorage.getItem('yongjeong-danawa-data');
    if (raw) {
      const parsed = JSON.parse(raw);
      return parsed[dataKey] || { photos: [], records: [] };
    }
    return { photos: [], records: [] };
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<'photos' | 'records'>('photos');
  const [showPhotoForm, setShowPhotoForm] = useState(false);
  const [showRecordForm, setShowRecordForm] = useState(false);
  const [commentingPhotoId, setCommentingPhotoId] = useState<string | null>(null);

  const [photoForm, setPhotoForm] = useState({ caption: '', date: new Date().toISOString().slice(0, 10), file: null as File | null });
  const [recordForm, setRecordForm] = useState({
    recordType: '병원치료' as RecordType,
    title: '',
    description: '',
    date: new Date().toISOString().slice(0, 10),
    hospital: '',
    cost: 0,
    nextVisit: '',
  });
  const [commentText, setCommentText] = useState('');

  function saveData(newData: ChildData) {
    setData(newData);
    const raw = localStorage.getItem('yongjeong-danawa-data');
    const allData = raw ? JSON.parse(raw) : {};
    allData[dataKey] = newData;
    localStorage.setItem('yongjeong-danawa-data', JSON.stringify(allData));
  }

  function handlePhotoSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!photoForm.file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const photo: ChildPhoto = {
        id: generateId(),
        dataUrl: reader.result as string,
        caption: photoForm.caption.trim(),
        date: photoForm.date,
        comments: [],
        createdAt: new Date().toISOString(),
      };
      saveData({ ...data, photos: [photo, ...data.photos] });
      setPhotoForm({ caption: '', date: new Date().toISOString().slice(0, 10), file: null });
      setShowPhotoForm(false);
    };
    reader.readAsDataURL(photoForm.file);
  }

  function handleRecordSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!recordForm.title.trim()) return;

    const record: ChildRecord = {
      id: generateId(),
      ...recordForm,
      createdAt: new Date().toISOString(),
    };
    saveData({ ...data, records: [record, ...data.records] });
    setRecordForm({
      recordType: '병원치료',
      title: '',
      description: '',
      date: new Date().toISOString().slice(0, 10),
      hospital: '',
      cost: 0,
      nextVisit: '',
    });
    setShowRecordForm(false);
  }

  function deletePhoto(id: string) {
    if (!window.confirm('사진을 삭제하시겠습니까?')) return;
    saveData({ ...data, photos: data.photos.filter((p) => p.id !== id) });
  }

  function deleteRecord(id: string) {
    if (!window.confirm('기록을 삭제하시겠습니까?')) return;
    saveData({ ...data, records: data.records.filter((r) => r.id !== id) });
  }

  function addComment(photoId: string) {
    if (!commentText.trim()) return;
    const comment: PhotoComment = {
      id: generateId(),
      text: commentText.trim(),
      date: new Date().toISOString().slice(0, 10),
      createdAt: new Date().toISOString(),
    };
    saveData({
      ...data,
      photos: data.photos.map((p) =>
        p.id === photoId ? { ...p, comments: [...p.comments, comment] } : p
      ),
    });
    setCommentText('');
    setCommentingPhotoId(null);
  }

  function deleteComment(photoId: string, commentId: string) {
    saveData({
      ...data,
      photos: data.photos.map((p) =>
        p.id === photoId ? { ...p, comments: p.comments.filter((c) => c.id !== commentId) } : p
      ),
    });
  }

  const sortedPhotos = [...data.photos].sort((a, b) => b.date.localeCompare(a.date));
  const sortedRecords = [...data.records].sort((a, b) => b.date.localeCompare(a.date));

  const inputStyle = {
    padding: '10px 14px',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-sm)',
    fontSize: '0.9rem',
    background: 'var(--color-surface)',
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
        <div
          style={{
            width: 44, height: 44, borderRadius: 'var(--radius-md)',
            background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <Icon size={22} style={{ color: iconColor }} />
        </div>
        <h2 style={{ fontFamily: 'var(--font-cute)', fontSize: '1.6rem', color: 'var(--color-text)' }}>
          {name} 뭐하지?
        </h2>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 24 }}>
        {([
          { key: 'photos', label: '사진 갤러리', icon: Camera },
          { key: 'records', label: '병원·예방접종·보험 기록', icon: Stethoscope },
        ] as const).map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '10px 20px', borderRadius: 'var(--radius-md)',
              fontFamily: 'var(--font-cute)', fontSize: '0.9rem',
              background: activeTab === tab.key ? iconColor : 'var(--color-bg)',
              color: activeTab === tab.key ? '#fff' : 'var(--color-text-light)',
              border: activeTab === tab.key ? `2px solid ${iconColor}` : '2px solid transparent',
            }}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
        <button
          onClick={() => activeTab === 'photos' ? setShowPhotoForm(!showPhotoForm) : setShowRecordForm(!showRecordForm)}
          style={{
            marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6,
            padding: '10px 20px', borderRadius: 'var(--radius-xl)',
            background: iconColor, color: '#fff',
            fontFamily: 'var(--font-cute)', fontSize: '0.9rem',
          }}
        >
          <Plus size={16} />
          {activeTab === 'photos' ? '사진 추가' : '기록 추가'}
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
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => setPhotoForm({ ...photoForm, file: e.target.files?.[0] || null })}
              style={{ ...inputStyle, width: '100%' }}
            />
            {photoForm.file && (
              <p style={{ fontSize: '0.8rem', color: 'var(--color-text-light)', marginTop: 4 }}>
                선택됨: {photoForm.file.name} ({(photoForm.file.size / 1024).toFixed(1)}KB)
              </p>
            )}
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: 4, color: 'var(--color-text-light)' }}>날짜</label>
            <input type="date" value={photoForm.date} onChange={(e) => setPhotoForm({ ...photoForm, date: e.target.value })}
              style={{ ...inputStyle, width: '100%' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: 4, color: 'var(--color-text-light)' }}>설명</label>
            <input type="text" placeholder="사진에 대한 간단한 설명" value={photoForm.caption}
              onChange={(e) => setPhotoForm({ ...photoForm, caption: e.target.value })}
              style={{ ...inputStyle, width: '100%' }} />
          </div>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <button type="button" onClick={() => setShowPhotoForm(false)}
              style={{ padding: '10px 20px', borderRadius: 'var(--radius-sm)', color: 'var(--color-text-light)', fontFamily: 'var(--font-cute)' }}>
              취소
            </button>
            <button type="submit"
              style={{ padding: '10px 24px', borderRadius: 'var(--radius-sm)', background: 'var(--color-primary)', color: '#fff', fontFamily: 'var(--font-cute)', fontSize: '0.95rem' }}>
              저장하기
            </button>
          </div>
        </form>
      )}

      {/* Record Form */}
      {activeTab === 'records' && showRecordForm && (
        <form onSubmit={handleRecordSubmit}
          style={{
            background: 'var(--color-card)', borderRadius: 'var(--radius-lg)', padding: '24px',
            marginBottom: 24, border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)',
            display: 'flex', flexDirection: 'column', gap: 14,
          }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: 4, color: 'var(--color-text-light)' }}>기록 유형</label>
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
              {recordTypes.map((rt) => (
                <button key={rt.value} type="button" onClick={() => setRecordForm({ ...recordForm, recordType: rt.value })}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 4,
                    padding: '8px 14px', borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-cute)', fontSize: '0.85rem',
                    background: recordForm.recordType === rt.value ? iconColor : 'var(--color-bg)',
                    color: recordForm.recordType === rt.value ? '#fff' : 'var(--color-text-light)',
                    border: recordForm.recordType === rt.value ? `2px solid ${iconColor}` : '2px solid var(--color-border)',
                  }}>
                  <rt.icon size={14} />{rt.label}
                </button>
              ))}
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: 4, color: 'var(--color-text-light)' }}>제목</label>
              <input type="text" placeholder="예: 독감 예방접종" value={recordForm.title}
                onChange={(e) => setRecordForm({ ...recordForm, title: e.target.value })}
                style={{ ...inputStyle, width: '100%' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: 4, color: 'var(--color-text-light)' }}>날짜</label>
              <input type="date" value={recordForm.date}
                onChange={(e) => setRecordForm({ ...recordForm, date: e.target.value })}
                style={{ ...inputStyle, width: '100%' }} />
            </div>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: 4, color: 'var(--color-text-light)' }}>병원명 (선택)</label>
            <input type="text" placeholder="병원 이름" value={recordForm.hospital}
              onChange={(e) => setRecordForm({ ...recordForm, hospital: e.target.value })}
              style={{ ...inputStyle, width: '100%' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: 4, color: 'var(--color-text-light)' }}>비용 (원)</label>
              <input type="number" value={recordForm.cost || ''} placeholder="0"
                onChange={(e) => setRecordForm({ ...recordForm, cost: Number(e.target.value) })}
                style={{ ...inputStyle, width: '100%' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: 4, color: 'var(--color-text-light)' }}>다음 방문일 (선택)</label>
              <input type="date" value={recordForm.nextVisit}
                onChange={(e) => setRecordForm({ ...recordForm, nextVisit: e.target.value })}
                style={{ ...inputStyle, width: '100%' }} />
            </div>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: 4, color: 'var(--color-text-light)' }}>상세 내용</label>
            <textarea value={recordForm.description} placeholder="상세 내용을 입력하세요"
              onChange={(e) => setRecordForm({ ...recordForm, description: e.target.value })}
              style={{ ...inputStyle, width: '100%', minHeight: 80, resize: 'vertical' }} />
          </div>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <button type="button" onClick={() => setShowRecordForm(false)}
              style={{ padding: '10px 20px', borderRadius: 'var(--radius-sm)', color: 'var(--color-text-light)', fontFamily: 'var(--font-cute)' }}>
              취소
            </button>
            <button type="submit"
              style={{ padding: '10px 24px', borderRadius: 'var(--radius-sm)', background: 'var(--color-primary)', color: '#fff', fontFamily: 'var(--font-cute)', fontSize: '0.95rem' }}>
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
            <p>{name}이의 사진을 올려보세요!</p>
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
                          style={{ padding: '6px 10px', borderRadius: 'var(--radius-sm)', background: iconColor, color: '#fff', fontSize: '0.8rem', fontFamily: 'var(--font-cute)' }}>
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

      {/* Records List */}
      {activeTab === 'records' && (
        sortedRecords.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '64px 20px', color: 'var(--color-text-lighter)', fontFamily: 'var(--font-cute)', fontSize: '1rem' }}>
            <Stethoscope size={32} style={{ marginBottom: 12, opacity: 0.4 }} />
            <p>{name}이의 병원·예방접종·보험 기록을 추가해보세요!</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {sortedRecords.map((record) => {
              const rt = recordTypes.find((r) => r.value === record.recordType);
              const RtIcon = rt?.icon || FileText;
              return (
                <div key={record.id}
                  style={{
                    background: 'var(--color-card)', borderRadius: 'var(--radius-md)',
                    padding: '16px 20px', border: '1px solid var(--color-border)',
                    display: 'flex', gap: 12, alignItems: 'flex-start',
                  }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 'var(--radius-sm)',
                    background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0, marginTop: 2,
                  }}>
                    <RtIcon size={16} style={{ color: iconColor }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <span style={{
                          fontSize: '0.7rem', padding: '2px 8px', borderRadius: 'var(--radius-xl)',
                          background: iconBg, color: iconColor, fontFamily: 'var(--font-cute)',
                        }}>
                          {rt?.label}
                        </span>
                        <span style={{ marginLeft: 8, fontWeight: 500, fontSize: '0.95rem' }}>{record.title}</span>
                      </div>
                      <button onClick={() => deleteRecord(record.id)} style={{ color: 'var(--color-text-lighter)' }}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-lighter)', marginTop: 4 }}>
                      {record.date}
                      {record.hospital && ` · ${record.hospital}`}
                      {record.cost != null && record.cost > 0 && ` · ${record.cost.toLocaleString()}원`}
                    </div>
                    {record.description && (
                      <p style={{ fontSize: '0.85rem', color: 'var(--color-text-light)', marginTop: 4 }}>{record.description}</p>
                    )}
                    {record.nextVisit && (
                      <div style={{ fontSize: '0.8rem', color: 'var(--color-accent)', marginTop: 4 }}>
                        다음 방문: {record.nextVisit}
                      </div>
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
