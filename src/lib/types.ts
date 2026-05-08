export type Role = "entrepreneur" | "coach" | "program_manager" | "admin" | "super_admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
  bio?: string;
  company?: string;
  jobTitle?: string;
  cohortId?: string;
  coachId?: string;
  initials?: string;
  gradient?: string;
}

export interface Program {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  description: string;
  duration: string;
  cover: string;
  modules: string[];
  active: boolean;
}

export interface Cohort {
  id: string;
  programId: string;
  name: string;
  startDate: string;
  endDate: string;
  memberIds: string[];
  managerId: string;
  state: "active" | "upcoming" | "archived";
}

export type FileType = "pdf" | "doc" | "image" | "video" | "audio" | "sheet" | "slides" | "zip" | "other";

export interface WorkFile {
  id: string;
  name: string;
  size: number;
  type: FileType;
  uploadedAt: string;
  uploadedById: string;
  folder?: string;
  preview?: string;
}

export type AssignmentStatus = "todo" | "in_progress" | "submitted" | "feedback" | "done";

export interface AssignmentFeedback {
  id: string;
  authorId: string;
  message: string;
  createdAt: string;
  fileIds?: string[];
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  module: string;
  dueDate: string;
  status: AssignmentStatus;
  submittedFileIds?: string[];
  feedback: AssignmentFeedback[];
  createdAt: string;
}

export interface WorkFolder {
  id: string;
  entrepreneurId: string;
  coachId: string;
  cohortId: string;
  programId: string;
  files: WorkFile[];
  assignments: Assignment[];
  notes?: string;
  retentionDays: number;
  archivedAt?: string;
}

export interface LibraryItem {
  id: string;
  programId: string;
  title: string;
  description: string;
  type: "video" | "document" | "deck" | "podcast" | "template";
  duration?: string;
  pages?: number;
  authorId?: string;
  module: string;
  tags: string[];
  thumbnail?: string;
  thumbnailSeed?: number;
  url?: string;
  publishedAt: string;
}

export interface ChatChannel {
  id: string;
  name: string;
  type: "cohort" | "subgroup" | "direct";
  cohortId?: string;
  memberIds: string[];
  description?: string;
  createdAt: string;
  pinnedMessageId?: string;
}

export interface ChatMessage {
  id: string;
  channelId: string;
  authorId: string;
  content: string;
  timestamp: string;
  reactions?: Record<string, string[]>;
  replyToId?: string;
  attachments?: { name: string; type: FileType; size: number }[];
}

export interface Notification {
  id: string;
  userId: string;
  type: "assignment" | "feedback" | "chat" | "library" | "system" | "session";
  title: string;
  body: string;
  link?: string;
  read: boolean;
  createdAt: string;
  fromUserId?: string;
}

export interface AuditEntry {
  id: string;
  actorId: string;
  action: string;
  target: string;
  targetType: "user" | "workfolder" | "file" | "permission" | "cohort" | "library";
  timestamp: string;
  meta?: Record<string, string | number | boolean>;
}

export interface CalendarEvent {
  id: string;
  cohortId?: string;
  programId?: string;
  title: string;
  type: "session" | "deadline" | "event" | "meeting";
  start: string;
  end?: string;
  location?: string;
  description?: string;
  prepLibraryItemIds?: string[];
}

export interface AIThread {
  id: string;
  userId: string;
  programId: string;
  title: string;
  messages: AIMessage[];
  createdAt: string;
}

export interface AIMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  citations?: { libraryItemId: string; snippet: string; page?: number; timestamp?: string }[];
  timestamp: string;
}
