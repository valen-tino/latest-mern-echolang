export interface TabsState {
  activeTab: string;
}

export interface AdminStats {
  totalUsers: number;
  activeTranslations: number;
  storageUsed: string;
  totalFeedback: number;
}

export interface FeedbackEntry {
  id: string;
  userId: string;
  userName: string;
  content: string;
  rating: number;
  createdAt: string;
  response?: string;
}