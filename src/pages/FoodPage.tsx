import { useState } from 'react';
import { Plus, Trash2, ChefHat, ShoppingBag, Bike, Coffee, Sun, Moon, Sunset } from 'lucide-react';
import { useAppData } from '../context/AppContext';
import { FoodEntry, MealType, PrepType } from '../types';

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

const mealTypes: { value: MealType; label: string; icon: typeof Coffee; color: string }[] = [
  { value: '아침', label: '아침', icon: Coffee, color: '#f0a060' },
  { value: '점심', label: '점심', icon: Sun, color: '#f0c040' },
  { value: '저녁', label: '저녁', icon: Sunset, color: '#c060a0' },
];

const prepTypes: { value: PrepType; label: string; icon: typeof ChefHat; color: string }[] = [
  { value: '조리', label: '조리', icon: ChefHat, color: 'var(--color-peach)' },
  { value: '포장', label: '포장', icon: ShoppingBag, color: 'var(--color-sky)' },
  { value: '배달', label: '배달', icon: Bike, color: 'var(--color-mint)' },
];

export default function FoodPage() {
  const { data, updateData } = useAppData();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    mealType: '아침' as MealType,
    menu: '',
    prepType: '조리' as PrepType,
    note: '',
  });

  function resetForm() {
    setForm({
      date: new Date().toISOString().slice(0, 10),
      mealType: '아침',
      menu: '',
      prepType: '조리',
      note: '',
    });
    setEditingId(null);
    setShowForm(false);
  }

  function startEdit(entry: FoodEntry) {
    setForm({
      date: entry.date,
      mealType: entry.mealType,
      menu: entry.menu,
      prepType: entry.prepType,
      note: entry.note,
    });
    setEditingId(entry.id);
    setShowForm(true);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.menu.trim()) {
      alert('메뉴를 입력해주세요.');
      return;
    }

    if (editingId) {
      updateData((prev) => ({
        ...prev,
        foodEntries: prev.foodEntries.map((entry) =>
          entry.id === editingId
            ? { ...entry, ...form, createdAt: new Date().toISOString() }
            : entry
        ),
      }));
    } else {
      const entry: FoodEntry = {
        id: generateId(),
        ...form,
        createdAt: new Date().toISOString(),
      };
      updateData((prev) => ({ ...prev, foodEntries: [entry, ...prev.foodEntries] }));
    }
    resetForm();
  }

  function deleteEntry(id: string) {
    if (!window.confirm('이 기록을 삭제하시겠습니까?')) return;
    updateData((prev) => ({
      ...prev,
      foodEntries: prev.foodEntries.filter((e) => e.id !== id),
    }));
  }

  const sortedEntries = [...data.foodEntries].sort(
    (a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt)
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
            background: 'var(--color-peach-light)', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
          }}
        >
          <ChefHat size={22} style={{ color: 'var(--color-peach)' }} />
        </div>
        <h2 style={{ fontFamily: 'var(--font-cute)', fontSize: '1.6rem', color: 'var(--color-text)' }}>
          오늘 뭐 먹지?
        </h2>
        <button
          onClick={() => { resetForm(); setShowForm(!showForm); }}
          style={{
            marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6,
            padding: '10px 20px', borderRadius: 'var(--radius-xl)',
            background: 'var(--color-peach)', color: '#fff',
            fontFamily: 'var(--font-cute)', fontSize: '0.9rem',
          }}
        >
          <Plus size={16} />
          {showForm ? '닫기' : '음식 추가'}
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
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: 4, color: 'var(--color-text-light)' }}>
              날짜
            </label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              style={{ ...inputStyle, width: '100%' }}
              required
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: 4, color: 'var(--color-text-light)' }}>
              시간대
            </label>
            <div style={{ display: 'flex', gap: 6 }}>
              {mealTypes.map((mt) => (
                <button
                  key={mt.value}
                  type="button"
                  onClick={() => setForm({ ...form, mealType: mt.value })}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 4,
                    padding: '8px 16px', borderRadius: 'var(--radius-sm)',
                    fontFamily: 'var(--font-cute)', fontSize: '0.85rem',
                    background: form.mealType === mt.value ? mt.color : 'var(--color-bg)',
                    color: form.mealType === mt.value ? '#fff' : 'var(--color-text-light)',
                    border: form.mealType === mt.value ? `2px solid ${mt.color}` : '2px solid var(--color-border)',
                  }}
                >
                  <mt.icon size={14} />
                  {mt.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: 4, color: 'var(--color-text-light)' }}>
              메뉴
            </label>
            <input
              type="text"
              placeholder="먹은 음식을 입력하세요 (예: 된장찌개, 김치볶음밥)"
              value={form.menu}
              onChange={(e) => setForm({ ...form, menu: e.target.value })}
              style={{ ...inputStyle, width: '100%' }}
              required
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: 4, color: 'var(--color-text-light)' }}>
              종류
            </label>
            <div style={{ display: 'flex', gap: 6 }}>
              {prepTypes.map((pt) => (
                <button
                  key={pt.value}
                  type="button"
                  onClick={() => setForm({ ...form, prepType: pt.value })}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 4,
                    padding: '8px 16px', borderRadius: 'var(--radius-sm)',
                    fontFamily: 'var(--font-cute)', fontSize: '0.85rem',
                    background: form.prepType === pt.value ? pt.color : 'var(--color-bg)',
                    color: form.prepType === pt.value ? '#fff' : 'var(--color-text-light)',
                    border: form.prepType === pt.value ? `2px solid ${pt.color}` : '2px solid var(--color-border)',
                  }}
                >
                  <pt.icon size={14} />
                  {pt.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: 4, color: 'var(--color-text-light)' }}>
              메모 (선택)
            </label>
            <textarea
              placeholder="간단한 메모를 남겨보세요"
              value={form.note}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
              style={{ ...inputStyle, width: '100%', minHeight: 60, resize: 'vertical' }}
            />
          </div>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={resetForm}
              style={{
                padding: '10px 20px', borderRadius: 'var(--radius-sm)',
                color: 'var(--color-text-light)', fontFamily: 'var(--font-cute)', fontSize: '0.9rem',
              }}
            >
              취소
            </button>
            <button
              type="submit"
              style={{
                padding: '10px 24px', borderRadius: 'var(--radius-sm)',
                background: 'var(--color-peach)', color: '#fff',
                fontFamily: 'var(--font-cute)', fontSize: '0.95rem',
              }}
            >
              {editingId ? '수정하기' : '저장하기'}
            </button>
          </div>
        </form>
      )}

      {/* List */}
      {sortedEntries.length === 0 ? (
        <div
          style={{
            textAlign: 'center', padding: '64px 20px',
            color: 'var(--color-text-lighter)', fontFamily: 'var(--font-cute)', fontSize: '1rem',
          }}
        >
          <ChefHat size={32} style={{ marginBottom: 12, opacity: 0.4 }} />
          <p>오늘 먹은 음식을 기록해보세요!</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {sortedEntries.map((entry) => {
            const mealInfo = mealTypes.find((m) => m.value === entry.mealType);
            const prepInfo = prepTypes.find((p) => p.value === entry.prepType);
            const MealIcon = mealInfo?.icon || Coffee;
            const PrepIcon = prepInfo?.icon || ChefHat;

            return (
              <div
                key={entry.id}
                style={{
                  background: 'var(--color-card)', borderRadius: 'var(--radius-md)',
                  padding: '16px 20px', border: '1px solid var(--color-border)',
                  display: 'flex', gap: 12, alignItems: 'flex-start',
                }}
              >
                <div
                  style={{
                    width: 40, height: 40, borderRadius: 'var(--radius-sm)',
                    background: mealInfo?.color + '20', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}
                >
                  <MealIcon size={18} style={{ color: mealInfo?.color }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span
                          style={{
                            fontSize: '0.7rem', padding: '2px 8px', borderRadius: 'var(--radius-xl)',
                            background: mealInfo?.color + '20', color: mealInfo?.color,
                            fontFamily: 'var(--font-cute)',
                          }}
                        >
                          {entry.mealType}
                        </span>
                        <span
                          style={{
                            fontSize: '0.7rem', padding: '2px 8px', borderRadius: 'var(--radius-xl)',
                            background: prepInfo?.color + '20', color: prepInfo?.color,
                            fontFamily: 'var(--font-cute)', display: 'flex', alignItems: 'center', gap: 3,
                          }}
                        >
                          <PrepIcon size={10} />
                          {entry.prepType}
                        </span>
                      </div>
                      <p style={{ fontWeight: 500, fontSize: '1rem', margin: '4px 0 2px' }}>
                        {entry.menu}
                      </p>
                      <div style={{ fontSize: '0.8rem', color: 'var(--color-text-lighter)' }}>
                        {entry.date}
                        {entry.note && ` · ${entry.note}`}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <button
                        onClick={() => startEdit(entry)}
                        style={{
                          fontSize: '0.75rem', padding: '4px 10px', borderRadius: 'var(--radius-sm)',
                          color: 'var(--color-primary)', fontFamily: 'var(--font-cute)',
                          background: 'var(--color-bg)',
                        }}
                      >
                        수정
                      </button>
                      <button
                        onClick={() => deleteEntry(entry.id)}
                        style={{ color: 'var(--color-text-lighter)', padding: 4 }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
