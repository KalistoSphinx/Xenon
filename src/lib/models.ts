export interface Note {
  id: string;
  title?: string;
  content?: any;
  isStarred?: boolean;
  isTrashed?: boolean;
  createdAt: string;
  updatedAt?: string;
  workspaceId?: string | null;
  userId?: string;
}

export interface Workspace {
  name: string;
  color: string;
}
