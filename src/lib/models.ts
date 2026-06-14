export interface Note {
  title: string;
  content: any;
  id: string;
  isStarred: boolean;
  trashedAt: Date;
  createdAt: Date;
}

export interface Workspace {
  id: string
  name: string;
  color: string;
}