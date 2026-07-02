import { useState } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Star, Users, Bot, Copy, CheckCircle } from 'lucide-react'
import XiaosiAvatar from '../components/XiaosiAvatar'
import { storage } from '../utils/storage'

function polishPlan(content: string): string {
  const sections = content.split(/\n(?=[一二三四五六七八九十]+[、.]|\d+[、.])/)

  let polished = `# 思想政治教育评估标准优化方案书\n\n`
  polished += `> **文档性质**：教育评估标准改革优化方案\n`
  polished += `> **编制依据**：《普通高等学校马克思主义学院建设标准（2019年本）》\n`
  polished += `> **编制日期**：${new Date().toLocaleDateString('zh-CN')}\n\n`
  polished += `---\n\n`

  if (sections.length <= 1) {
    polished += `## 方案正文\n\n${content}\n\n`
  } else {
    for (const section of sections) {
      const trimmed = section.trim()
      if (!trimmed) continue
      const titleMatch = trimmed.match(/^([一二三四五六七八九十]+[、.]|\d+[、.])(.+)/)
      if (titleMatch) {
        polished += `## ${titleMatch[1]} ${titleMatch[2].split('\n')[0]}\n\n`
        const body = trimmed.slice(titleMatch[0].length).trim()
        if (body) {
          polished += body.split('\n').map(line => {
            if (line.match(/^[•\-\*]\s/)) return line
            if (line.trim()) return line
            return ''
          }).filter(Boolean).join('\n\n') + '\n\n'
        }
      } else {
        polished += `${trimmed}\n\n`
      }
    }
  }

  polished += `---\n\n`
  polished += `## 附录：国际经验参考索引\n\n`
  polished += `| 国家 | 核心经验 | 可借鉴要点 |\n`
  polished += `|------|---------|----------|\n`
  polished += `| 美国 | 服务学习模式 | 多元评估主体、过程性档案 |\n`
  polished += `| 英国 | QAA质量保障 | 全链条评估、跨学科融合 |\n`
  polished += `| 德国 | 能力导向评估 | 三维能力模型、分级标准 |\n`
  polished += `| 日本 | 精细化指标 | 120+指标、质性量化结合 |\n\n`

  polished += `*本方案由AI学伴小思辅助美化，既体现专业性和规范性，又富有可读性。*\n`

  return polished
}

function aiEvaluate(content: string): { score: number; comment: string } {
  const { score } = (() => {
    let s = 60
    const keywords = ['第三方', '差异化', '跨学科', '质量', '过程', '美国', '英国', '德国', '日本', '指标', 'PDCA']
    const found = keywords.filter(k => content.includes(k))
    s += found.length * 5
    s = Math.min(s, 95)
    return { score: s }
  })()

  const comment = `作为AI学伴小思，我对您的方案进行了全面评估：

📊 **专业性** (${Math.min(score, 90)}/100)：方案${content.includes('指标') ? '构建了较为系统的评估框架' : '建议进一步细化评估指标体系'}。

🌍 **国际视野** (${content.match(/美国|英国|德国|日本/g)?.length ?? 0 >= 2 ? 85 : 65}/100)：${(content.match(/美国|英国|德国|日本/g)?.length ?? 0) >= 2 ? '成功借鉴了多国经验' : '建议增加更多国际经验参考'}。

🔗 **跨学科融合** (${content.includes('跨学科') ? 88 : 60}/100)：${content.includes('跨学科') ? '体现了多学科交叉视角' : '建议融入社会学、心理学等学科视角'}。

✨ **创新程度** (${content.includes('第三方') && content.includes('差异化') ? 90 : 70}/100)：${content.includes('第三方') ? '引入第三方评估是重要创新' : '建议引入多元评估主体'}。

**总评**：${score >= 85 ? '优秀方案，逻辑清晰、措施具体，具备较强的可操作性。' : score >= 70 ? '良好方案，框架合理但部分环节需要进一步细化。' : '方案已有基本框架，建议参考AI学伴提供的各国经验进行完善。'}`

  return { score, comment }
}

export default function PostClass() {
  const [plans] = useState(storage.getPlans())
  const [selectedPlanId, setSelectedPlanId] = useState(plans[0]?.id ?? '')
  const [polished, setPolished] = useState('')
  const [polishing, setPolishing] = useState(false)
  const [copied, setCopied] = useState(false)

  const selectedPlan = plans.find(p => p.id === selectedPlanId)
  const existingPolished = storage.getPolished().find(p => p.originalId === selectedPlanId)

  const [selfScore, setSelfScore] = useState(0)
  const [selfComment, setSelfComment] = useState('')
  const [peerScore, setPeerScore] = useState(0)
  const [peerComment, setPeerComment] = useState('')
  const [evalSubmitted, setEvalSubmitted] = useState(false)

  const handlePolish = () => {
    if (!selectedPlan) return
    setPolishing(true)
    setTimeout(() => {
      const result = polishPlan(selectedPlan.content)
      setPolished(result)
      storage.addPolished({ originalId: selectedPlan.id, polishedContent: result, polishedAt: Date.now() })
      setPolishing(false)
    }, 1500)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(polished || existingPolished?.polishedContent || '')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleEvalSubmit = () => {
    if (!selectedPlan) return
    const ai = aiEvaluate(selectedPlan.content)
    storage.addEvaluation({
      planId: selectedPlan.id,
      selfScore,
      selfComment,
      peerScore,
      peerComment,
      aiScore: ai.score,
      aiComment: ai.comment,
    })
    setEvalSubmitted(true)
  }

  const aiEval = selectedPlan ? aiEvaluate(selectedPlan.content) : null

  if (plans.length === 0) {
    return (
      <div className="card text-center py-16">
        <Sparkles className="mx-auto text-stone-300 mb-4" size={48} />
        <h2 className="text-xl font-semibold text-stone-600 mb-2">暂无方案可评价</h2>
        <p className="text-stone-400">请先在"课中实践"页面提交优化方案书</p>
      </div>
    )
  }

  return (
    <div className="space-y-10">
      {/* Plan selector */}
      <div className="flex gap-2 flex-wrap">
        {plans.map(p => (
          <button
            key={p.id}
            onClick={() => { setSelectedPlanId(p.id); setPolished(''); setEvalSubmitted(false) }}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              selectedPlanId === p.id ? 'bg-primary-500 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            {p.groupName}
          </button>
        ))}
      </div>

      {/* AI Polish */}
      <section>
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="text-primary-500" size={24} />
          <h2 className="section-title !mb-0">AI美化方案</h2>
        </div>
        <p className="section-subtitle">运用AI美化方案，既体现专业性和规范性，又富有可读性和美观性</p>

        <div className="card">
          {!polished && !existingPolished ? (
            <div className="text-center py-8">
              <XiaosiAvatar size="lg" className="mx-auto mb-4" />
              <p className="text-stone-500 mb-4">小思将为您美化方案书，添加规范格式、目录结构和附录索引</p>
              <button onClick={handlePolish} className="btn-primary" disabled={polishing}>
                {polishing ? '美化中...' : '✨ 开始AI美化'}
              </button>
            </div>
          ) : (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-stone-700">美化后的方案书</h3>
                <div className="flex gap-2">
                  <button onClick={handleCopy} className="btn-secondary text-sm flex items-center gap-1">
                    {copied ? <CheckCircle size={14} /> : <Copy size={14} />}
                    {copied ? '已复制' : '复制'}
                  </button>
                  <button onClick={handlePolish} className="btn-secondary text-sm flex items-center gap-1">
                    <Sparkles size={14} /> 重新美化
                  </button>
                </div>
              </div>
              <div className="bg-stone-50 rounded-xl p-6 max-h-[500px] overflow-y-auto font-serif">
                <pre className="whitespace-pre-wrap text-sm text-stone-700 leading-relaxed">
                  {polished || existingPolished?.polishedContent}
                </pre>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Triple Evaluation */}
      <section>
        <div className="flex items-center gap-2 mb-1">
          <Star className="text-primary-500" size={24} />
          <h2 className="section-title !mb-0">课后评价</h2>
        </div>
        <p className="section-subtitle">自评、互评、AI学伴评 — 三位一体综合评价</p>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Self evaluation */}
          <div className="card border-t-4 border-t-blue-400">
            <div className="flex items-center gap-2 mb-4">
              <Star className="text-blue-500" size={20} />
              <h3 className="font-semibold">自评</h3>
            </div>
            <label className="block mb-3">
              <span className="text-sm text-stone-600">评分 (0-100)</span>
              <input
                type="range" min="0" max="100"
                className="w-full mt-1 accent-blue-500"
                value={selfScore}
                onChange={e => setSelfScore(Number(e.target.value))}
              />
              <span className="text-2xl font-bold text-blue-600">{selfScore}</span>
            </label>
            <textarea
              className="input-field min-h-[100px] resize-none text-sm"
              placeholder="自我评价：方案的优势与不足..."
              value={selfComment}
              onChange={e => setSelfComment(e.target.value)}
            />
          </div>

          {/* Peer evaluation */}
          <div className="card border-t-4 border-t-green-400">
            <div className="flex items-center gap-2 mb-4">
              <Users className="text-green-500" size={20} />
              <h3 className="font-semibold">互评</h3>
            </div>
            <label className="block mb-3">
              <span className="text-sm text-stone-600">评分 (0-100)</span>
              <input
                type="range" min="0" max="100"
                className="w-full mt-1 accent-green-500"
                value={peerScore}
                onChange={e => setPeerScore(Number(e.target.value))}
              />
              <span className="text-2xl font-bold text-green-600">{peerScore}</span>
            </label>
            <textarea
              className="input-field min-h-[100px] resize-none text-sm"
              placeholder="互评意见：对其他小组方案的评价..."
              value={peerComment}
              onChange={e => setPeerComment(e.target.value)}
            />
          </div>

          {/* AI evaluation */}
          <div className="card border-t-4 border-t-primary-400">
            <div className="flex items-center gap-2 mb-4">
              <Bot className="text-primary-500" size={20} />
              <h3 className="font-semibold">AI学伴评</h3>
            </div>
            {aiEval && (
              <>
                <div className="text-center mb-3">
                  <span className="text-3xl font-bold text-primary-600">{aiEval.score}</span>
                  <span className="text-sm text-stone-400 ml-1">/ 100</span>
                </div>
                <div className="bg-primary-50 rounded-xl p-3 max-h-[160px] overflow-y-auto">
                  <p className="text-xs text-primary-700 whitespace-pre-line leading-relaxed">{aiEval.comment}</p>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="mt-6 text-center">
          <button onClick={handleEvalSubmit} className="btn-primary" disabled={evalSubmitted}>
            {evalSubmitted ? '✅ 评价已提交' : '提交课后评价'}
          </button>
        </div>

        {evalSubmitted && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="card mt-6 bg-gradient-to-r from-primary-50 to-gold-400/10"
          >
            <h3 className="font-semibold text-stone-800 mb-4 text-center">📊 综合评价结果</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">{selfScore}</div>
                <div className="text-sm text-stone-500">自评</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">{peerScore}</div>
                <div className="text-sm text-stone-500">互评</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary-600">{aiEval?.score}</div>
                <div className="text-sm text-stone-500">AI学伴评</div>
              </div>
            </div>
            <div className="text-center mt-4">
              <span className="text-lg font-semibold text-stone-700">
                综合得分：{Math.round((selfScore + peerScore + (aiEval?.score ?? 0)) / 3)}
              </span>
            </div>
          </motion.div>
        )}
      </section>
    </div>
  )
}
