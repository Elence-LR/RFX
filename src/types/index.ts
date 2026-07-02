export interface StudentAnswer {
  id: string
  interest: string
  confusion: string
  learningStyle: 'video' | 'text' | 'image' | null
  timestamp: number
}

export interface OptimizationPlan {
  id: string
  groupName: string
  leaderName: string
  content: string
  submittedAt: number
  score?: number
  feedback?: string
}

export interface PolishedPlan {
  originalId: string
  polishedContent: string
  polishedAt: number
}

export interface Evaluation {
  planId: string
  selfScore: number
  selfComment: string
  peerScore: number
  peerComment: string
  aiScore: number
  aiComment: string
}

export interface CollectedInfo {
  id: string
  country: string
  content: string
  timestamp: number
}
