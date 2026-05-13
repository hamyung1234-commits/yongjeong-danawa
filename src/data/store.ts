import { AppData, ChildData, CoupleData } from '../types';

const STORAGE_KEY = 'yongjeong-danawa-data';

const defaultChildData: ChildData = {
  photos: [],
  records: [],
};

const defaultCoupleData: CoupleData = {
  photos: [],
  anniversaries: [],
};

const defaultData: AppData = {
  foodEntries: [],
  travelEntries: [],
  dajungData: defaultChildData,
  danaData: defaultChildData,
  coupleData: defaultCoupleData,
};

export function loadData(): AppData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as AppData;
      return {
        ...defaultData,
        ...parsed,
        dajungData: { ...defaultChildData, ...parsed.dajungData },
        danaData: { ...defaultChildData, ...parsed.danaData },
        coupleData: { ...defaultCoupleData, ...parsed.coupleData },
      };
    }
  } catch (e) {
    console.error('Failed to load data from localStorage:', e);
  }
  return defaultData;
}

export function saveData(data: AppData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save data to localStorage:', e);
    alert('저장 공간이 부족합니다. 일부 사진을 삭제해주세요.');
  }
}

export function clearAllData(): void {
  localStorage.removeItem(STORAGE_KEY);
}
