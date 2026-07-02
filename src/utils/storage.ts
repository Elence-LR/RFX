import type { StudentAnswer, OptimizationPlan, PolishedPlan, Evaluation, CollectedInfo } from '../types'

const KEYS = {
  answers: 'rfx_answers',
  plans: 'rfx_plans',
  polished: 'rfx_polished',
  evaluations: 'rfx_evaluations',
  collected: 'rfx_collected',
}

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function save<T>(key: string, data: T): void {
  localStorage.setItem(key, JSON.stringify(data))
}

export const storage = {
  getAnswers: () => load<StudentAnswer[]>(KEYS.answers, []),
  addAnswer: (answer: StudentAnswer) => {
    const list = storage.getAnswers()
    list.push(answer)
    save(KEYS.answers, list)
  },

  getPlans: () => load<OptimizationPlan[]>(KEYS.plans, []),
  addPlan: (plan: OptimizationPlan) => {
    const list = storage.getPlans()
    list.push(plan)
    save(KEYS.plans, list)
  },
  updatePlan: (id: string, updates: Partial<OptimizationPlan>) => {
    const list = storage.getPlans().map(p => p.id === id ? { ...p, ...updates } : p)
    save(KEYS.plans, list)
  },

  getPolished: () => load<PolishedPlan[]>(KEYS.polished, []),
  addPolished: (plan: PolishedPlan) => {
    const list = storage.getPolished()
    const idx = list.findIndex(p => p.originalId === plan.originalId)
    if (idx >= 0) list[idx] = plan
    else list.push(plan)
    save(KEYS.polished, list)
  },

  getEvaluations: () => load<Evaluation[]>(KEYS.evaluations, []),
  addEvaluation: (ev: Evaluation) => {
    const list = storage.getEvaluations()
    const idx = list.findIndex(e => e.planId === ev.planId)
    if (idx >= 0) list[idx] = ev
    else list.push(ev)
    save(KEYS.evaluations, list)
  },

  getCollected: () => load<CollectedInfo[]>(KEYS.collected, []),
  addCollected: (info: CollectedInfo) => {
    const list = storage.getCollected()
    list.push(info)
    save(KEYS.collected, list)
  },
}
