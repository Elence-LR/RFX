import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ClipboardList, Video, FileText, Image, BookOpen, ChevronRight, CheckCircle } from 'lucide-react'
import { LEARNING_CONTENT, RESOURCE_PACK } from '../data/content'
import { storage } from '../utils/storage'

type LearningMode = 'video' | 'text' | 'image' | null

export default function PreClass() {
  const [interest, setInterest] = useState('')
  const [confusion, setConfusion] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [learningMode, setLearningMode] = useState<LearningMode>(null)

  const handleSubmit = () => {
    if (!interest.trim() || !confusion.trim()) return
    storage.addAnswer({
      id: Date.now().toString(),
      interest,
      confusion,
      learningStyle: learningMode,
      timestamp: Date.now(),
    })
    setSubmitted(true)
    setInterest('')
    setConfusion('')
  }

  const learningModes = [
    { key: 'video' as const, label: '视频', icon: Video, color: 'from-red-400 to-red-600' },
    { key: 'text' as const, label: '文字', icon: FileText, color: 'from-blue-400 to-blue-600' },
    { key: 'image' as const, label: '图片', icon: Image, color: 'from-green-400 to-green-600' },
  ]

  return (
    <div className="space-y-10">
      {/* Section 1: Pre-class Questions */}
      <section>
        <div className="flex items-center gap-2 mb-1">
          <ClipboardList className="text-primary-500" size={24} />
          <h2 className="section-title !mb-0">课前问卷</h2>
        </div>
        <p className="section-subtitle">回答以下问题，帮助老师了解你的学习需求与困惑</p>

        <div className="card max-w-2xl space-y-4">
          <label className="block">
            <span className="font-medium text-stone-700">1. 关于国内外思想政治教育评估标准，你最感兴趣的是什么？</span>
            <textarea
              className="input-field mt-2 min-h-[100px] resize-none"
              placeholder="例如：第三方评估机制、差异化标准设计..."
              value={interest}
              onChange={e => setInterest(e.target.value)}
            />
          </label>
          <label className="block">
            <span className="font-medium text-stone-700">2. 关于国内外思想政治教育评估标准，你最困惑的点是什么？</span>
            <textarea
              className="input-field mt-2 min-h-[100px] resize-none"
              placeholder="例如：如何平衡量化与质性评估、跨学科如何融合..."
              value={confusion}
              onChange={e => setConfusion(e.target.value)}
            />
          </label>
          <button onClick={handleSubmit} className="btn-primary w-full" disabled={!interest.trim() || !confusion.trim()}>
            提交回答
          </button>
          {submitted && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-green-600 text-sm flex items-center gap-1">
              <CheckCircle size={16} /> 提交成功！
            </motion.p>
          )}
        </div>
      </section>

      {/* Section 2: Learning Style */}
      <section>
        <div className="flex items-center gap-2 mb-1">
          <BookOpen className="text-primary-500" size={24} />
          <h2 className="section-title !mb-0">课前学习</h2>
        </div>
        <p className="section-subtitle">你最喜欢用什么样的方式进行学习？选择后将展示相应的学习内容</p>

        <div className="grid grid-cols-3 gap-4 mb-6">
          {learningModes.map(({ key, label, icon: Icon, color }) => (
            <button
              key={key}
              onClick={() => setLearningMode(key)}
              className={`card text-center cursor-pointer transition-all hover:shadow-md ${
                learningMode === key ? 'ring-2 ring-primary-400 shadow-md' : ''
              }`}
            >
              <div className={`w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center mb-3`}>
                <Icon size={28} className="text-white" />
              </div>
              <span className="font-medium text-stone-700">{label}</span>
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {learningMode && (
            <motion.div
              key={learningMode}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="card"
            >
              <h3 className="text-lg font-semibold mb-4">{LEARNING_CONTENT[learningMode].title}</h3>

              {learningMode === 'video' && (
                <div className="grid md:grid-cols-2 gap-4">
                  {LEARNING_CONTENT.video.items.map((item, i) => (
                    <div key={i} className="border border-stone-100 rounded-xl overflow-hidden hover:shadow-sm transition-shadow">
                      <div className="bg-gradient-to-br from-stone-800 to-stone-900 h-36 flex items-center justify-center relative">
                        <Video size={40} className="text-white/80" />
                        <span className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded">{item.duration}</span>
                      </div>
                      <div className="p-4">
                        <h4 className="font-medium text-stone-800 mb-1">{item.title}</h4>
                        <p className="text-sm text-stone-500 leading-relaxed">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {learningMode === 'text' && (
                <div className="space-y-4">
                  {LEARNING_CONTENT.text.sections.map((sec, i) => (
                    <div key={i} className="border-l-4 border-primary-400 pl-4 py-2">
                      <h4 className="font-semibold text-stone-800 mb-2">{sec.country}</h4>
                      <p className="text-sm text-stone-600 whitespace-pre-line leading-relaxed">{sec.content}</p>
                    </div>
                  ))}
                </div>
              )}

              {learningMode === 'image' && (
                <div className="space-y-6">
                  {LEARNING_CONTENT.image.charts.map((chart, i) => (
                    <div key={i}>
                      <h4 className="font-medium text-stone-800 mb-1">{chart.title}</h4>
                      <p className="text-sm text-stone-500 mb-3">{chart.description}</p>
                      <div className="space-y-2">
                        {'dimensions' in chart.data[0] ? (
                          chart.data.map((d, j) => {
                            const item = d as { country: string; dimensions: number; qualitative: number; quantitative: number }
                            return (
                              <div key={j} className="flex items-center gap-3">
                                <span className="text-sm w-24 text-stone-600 shrink-0">{item.country}</span>
                                <div className="flex-1 flex h-6 rounded overflow-hidden">
                                  <div className="bg-primary-400" style={{ width: `${item.qualitative}%` }} title={`质性 ${item.qualitative}%`} />
                                  <div className="bg-gold-400" style={{ width: `${item.quantitative}%` }} title={`量化 ${item.quantitative}%`} />
                                </div>
                                <span className="text-xs text-stone-400 w-16">{item.dimensions}维</span>
                              </div>
                            )
                          })
                        ) : 'external' in chart.data[0] ? (
                          chart.data.map((d, j) => {
                            const item = d as { country: string; external: number }
                            return (
                              <div key={j} className="flex items-center gap-3">
                                <span className="text-sm w-24 text-stone-600 shrink-0">{item.country}</span>
                                <div className="flex-1 bg-stone-100 rounded-full h-5 overflow-hidden">
                                  <div className="bg-primary-500 h-full rounded-full transition-all" style={{ width: `${item.external}%` }} />
                                </div>
                                <span className="text-xs text-stone-500 w-10">{item.external}%</span>
                              </div>
                            )
                          })
                        ) : (
                          chart.data.map((d, j) => {
                            const item = d as { country: string; frequency: string }
                            return (
                              <div key={j} className="flex items-center gap-3">
                                <span className="text-sm w-24 text-stone-600 shrink-0">{item.country}</span>
                                <span className="text-sm bg-stone-100 px-3 py-1 rounded-full text-stone-600">{item.frequency}</span>
                              </div>
                            )
                          })
                        )}
                      </div>
                      {'dimensions' in chart.data[0] && (
                        <div className="flex gap-4 mt-2 text-xs text-stone-400">
                          <span className="flex items-center gap-1"><span className="w-3 h-3 bg-primary-400 rounded inline-block" /> 质性评估</span>
                          <span className="flex items-center gap-1"><span className="w-3 h-3 bg-gold-400 rounded inline-block" /> 量化评估</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Section 3: Resource Pack */}
      <section>
        <div className="flex items-center gap-2 mb-1">
          <BookOpen className="text-primary-500" size={24} />
          <h2 className="section-title !mb-0">跨学科资源包</h2>
        </div>
        <p className="section-subtitle">教育学、社会学、心理学跨学科理论知识</p>

        <div className="grid md:grid-cols-3 gap-6">
          {RESOURCE_PACK.map((cat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`card border ${cat.color}`}
            >
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">{cat.icon}</span>
                <h3 className="font-semibold text-stone-800">{cat.category}</h3>
              </div>
              <ul className="space-y-3">
                {cat.items.map((item, j) => (
                  <li key={j} className="group">
                    <div className="flex items-start gap-2">
                      <ChevronRight size={16} className="text-primary-400 mt-1 shrink-0 group-hover:translate-x-0.5 transition-transform" />
                      <div>
                        <h4 className="text-sm font-medium text-stone-700">{item.title}</h4>
                        <p className="text-xs text-stone-500 mt-0.5 leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  )
}
