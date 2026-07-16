export interface AppNotification {
  id: string;
  title: string;
  body: string;
  isRead: boolean;
  createdAt: string;
  /** Set by MovieService/EpisodeService/ShortsService when announcing new
   * content — see notification-broadcast.service.ts on the backend. */
  metadata?: {
    thumbnail?: string;
    link?: string;
  };
}
