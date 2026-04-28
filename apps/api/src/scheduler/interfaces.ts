export enum SchedulerJobName {
  PUBLISH_POST = 'publish-post',
  REMIND_POST = 'remind-post',
  PROCESS_AI_QUEUE = 'process-ai-queue',
  CLEANUP_DRAFTS = 'cleanup-drafts',
}

export enum JobStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
}

export interface PublishPostJobData {
  postId: string;
  brandId: string;
  workspaceId: string;
  scheduledFor: Date;
}

export interface RemindPostJobData {
  postId: string;
  userId: string;
  message: string;
}

export interface QueuedAiRequest {
  id: string;
  workspaceId: string;
  feature: string;
  payload: Record<string, unknown>;
}