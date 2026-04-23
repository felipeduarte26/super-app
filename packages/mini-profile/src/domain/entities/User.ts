export interface User {
  id: string;
  name: string;
  email: string;
  bio: string;
  avatarUrl: string | null;
  memberSince: Date;
}
