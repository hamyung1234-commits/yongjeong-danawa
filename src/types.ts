export type MealType = '아침' | '점심' | '저녁';
export type PrepType = '조리' | '포장' | '배달';

export interface FoodEntry {
  id: string;
  date: string; // ISO date YYYY-MM-DD
  mealType: MealType;
  menu: string;
  prepType: PrepType;
  note: string;
  createdAt: string;
}

export type TransportType = '비행기' | '자동차' | '열차' | '배' | '기타';
export type PaymentType = '신용카드' | '현금' | '계좌이체' | '기타';
export type RegionType = '대한민국' | '동남아' | '유럽' | '북미' | '일본' | '중국' | '오세아니아' | '기타';
export type SatisfactionType = '매우만족' | '만족' | '보통' | '불만족' | '매우불만족';

export interface TravelEntry {
  id: string;
  startDate: string;
  endDate: string;
  region: RegionType;
  city: string;
  transport: TransportType;
  payment: PaymentType;
  mileageUsed: number;
  mileageRemaining: number;
  hotel: string;
  hotelPrice: number;
  stayDays: number;
  satisfaction: SatisfactionType;
  photos: string[];
  note: string;
  createdAt: string;
}

export interface PhotoComment {
  id: string;
  text: string;
  date: string;
  createdAt: string;
}

export interface ChildPhoto {
  id: string;
  dataUrl: string;
  caption: string;
  date: string;
  comments: PhotoComment[];
  createdAt: string;
}

export type RecordType = '병원치료' | '예방접종' | '보험' | '기타';

export interface ChildRecord {
  id: string;
  recordType: RecordType;
  title: string;
  description: string;
  date: string;
  hospital?: string;
  cost?: number;
  nextVisit?: string;
  createdAt: string;
}

export interface ChildData {
  photos: ChildPhoto[];
  records: ChildRecord[];
}

export type AnniversaryType = '결혼기념일' | '첫만남' | '생일' | '기타기념일';

export interface Anniversary {
  id: string;
  type: AnniversaryType;
  title: string;
  date: string; // MM-DD format for recurring
  year?: number;
  phoneNumber: string;
  notifyEnabled: boolean;
  notifyDaysBefore: number;
  note: string;
  createdAt: string;
}

export interface CouplePhoto {
  id: string;
  dataUrl: string;
  caption: string;
  date: string;
  comments: PhotoComment[];
  createdAt: string;
}

export interface CoupleData {
  photos: CouplePhoto[];
  anniversaries: Anniversary[];
}

export interface AppData {
  foodEntries: FoodEntry[];
  travelEntries: TravelEntry[];
  dajungData: ChildData;
  danaData: ChildData;
  coupleData: CoupleData;
}
