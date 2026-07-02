import { useState } from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle, User, Target, FileEdit, Award, Send } from 'lucide-react'
import AICompanion from '../components/AICompanion'
import { SCENARIO } from '../data/content'
import { storage } from '../utils/storage'

function scorePlan(content: string): { score: number; feedback: string } {
  let score = 60
  const checks = [
    { keyword: ['第三方', '外部', '社区', '受益对象'], points: 8, tip: '引入第三方评估主体' },
    { keyword: ['差异化', '分类', '专业', '文理科'], points: 8, tip: '建立差异化评估标准' },
    { keyword: ['跨学科', '社会学', '心理学', '教育学'], points: 8, tip: '融合跨学科评估视角' },
    { keyword: ['质量', '质性', '满意度', '适配度'], points: 8, tip: '关注服务质量评估' },
    { keyword: ['过程', '档案', '成长', '跟踪'], points: 6, tip: '建立过程性评估机制' },
    { keyword: ['美国', '英国', '德国', '日本', '借鉴', '国际'], points: 6, tip: '借鉴国际成功经验' },
    { keyword: ['指标', '维度', '体系', '框架'], points: 4, tip: '构建系统化评估框架' },
    { keyword: ['PDCA', '持续改进', '反馈', '迭代'], points: 4, tip: '建立持续改进机制' },
  ]

  const matched: string[] = []
  const missing: string[] = []

  for (const check of checks) {
    if (check.keyword.some(k => content.includes(k))) {
      score += check.points
      matched.push(check.tip)
    } else {
      missing.push(check.tip)
    }
  }

  score = Math.min(score, 98)

  let feedback = ''
  if (matched.length > 0) {
    feedback += `✅ 方案亮点：\n${matched.map(m => `• ${m}`).join('\n')}\n\n`
  }
  if (missing.length > 0) {
    feedback += `💡 改进建议：\n${missing.slice(0, 4).map(m => `• 建议补充：${m}`).join('\n')}`
  }

  if (content.length < 200) {
    feedback += '\n\n⚠️ 方案内容较为简略，建议进一步展开论述，增加具体实施步骤和保障措施。'
    score = Math.max(score - 10, 50)
  }

  return { score, feedback }
}

export default function InClass() {
  const [groupName, setGroupName] = useState('')
  const [leaderName, setLeaderName] = useState('')
  const [planContent, setPlanContent] = useState('')
  const [plans, setPlans] = useState(storage.getPlans())
  const [activeTab, setActiveTab] = useState<'ai' | 'submit' | 'review'>('ai')

  const handleSubmit = () => {
    if (!groupName.trim() || !leaderName.trim() || !planContent.trim()) return

    const { score, feedback } = scorePlan(planContent)
    const plan = {
      id: Date.now().toString(),
      groupName,
      leaderName,
      content: planContent,
      submittedAt: Date.now(),
      score,
      feedback,
    }
    storage.addPlan(plan)
    setPlans(storage.getPlans())
    setPlanContent('')
    setActiveTab('review')
  }

  return (
    <div className="space-y-8">
      {/* Scenario */}
      <section className="card border-l-4 border-l-primary-500">
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle className="text-primary-500" size={22} />
          <h2 className="section-title !mb-0">{SCENARIO.title}</h2>
        </div>

        <p className="text-stone-600 leading-relaxed mb-4">{SCENARIO.background}</p>

        <div className="bg-red-50 rounded-xl p-4 mb-4">
          <h4 className="font-medium text-red-800 mb-2">现存问题：</h4>
          <ul className="space-y-1.5">
            {SCENARIO.problems.map((p, i) => (
              <li key={i} className="text-sm text-red-700 flex items-start gap-2">
                <span className="text-red-400 mt-0.5">•</span> {p}
              </li>
            ))}
          </ul>
        </div>

        <p className="text-stone-600 mb-4 font-medium">{SCENARIO.trigger}</p>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="flex items-start gap-3 bg-primary-50 rounded-xl p-4">
            <User className="text-primary-500 shrink-0 mt-0.5" size={20} />
            <div>
              <h4 className="font-medium text-primary-800">你的身份</h4>
              <p className="text-sm text-primary-600 mt-1">{SCENARIO.role}</p>
            </div>
          </div>
          <div className="flex items-start gap-3 bg-gold-400/10 rounded-xl p-4">
            <Target className="text-gold-500 shrink-0 mt-0.5" size={20} />
            <div>
              <h4 className="font-medium text-stone-800">你的任务</h4>
              <p className="text-sm text-stone-600 mt-1">{SCENARIO.task}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <div className="flex gap-2">
        {[
          { key: 'ai' as const, label: 'AI学伴小思', icon: '🤖' },
          { key: 'submit' as const, label: '提交方案', icon: '📝' },
          { key: 'review' as const, label: '方案评审', icon: '📊' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
              activeTab === tab.key
                ? 'bg-primary-500 text-white shadow-sm'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'ai' && <AICompanion />}

      {activeTab === 'submit' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <FileEdit className="text-primary-500" size={22} />
            <h3 className="text-lg font-semibold">提交优化方案书</h3>
          </div>
          <p className="text-sm text-stone-500">请组长填写小组信息并提交优化方案（可先通过AI学伴收集各国经验）</p>

          <div className="grid md:grid-cols-2 gap-4">
            <label className="block">
              <span className="text-sm font-medium text-stone-700">小组名称</span>
              <input className="input-field mt-1" placeholder="如：第3组" value={groupName} onChange={e => setGroupName(e.target.value)} />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-stone-700">组长姓名</span>
              <input className="input-field mt-1" placeholder="请输入组长姓名" value={leaderName} onChange={e => setLeaderName(e.target.value)} />
            </label>
          </div>

          <label className="block">
            <span className="text-sm font-medium text-stone-700">优化方案书内容</span>
            <textarea
              className="input-field mt-1 min-h-[300px] resize-y font-serif leading-relaxed"
              placeholder={`请撰写教育评估标准优化方案，建议包含：\n\n一、现状问题分析\n二、国际经验借鉴（美国/英国/德国/日本等）\n三、评估体系重构方案\n四、差异化评估标准设计\n五、第三方评估机制\n六、跨学科融合路径\n七、实施保障措施`}
              value={planContent}
              onChange={e => setPlanContent(e.target.value)}
            />
          </label>

          <div className="flex justify-between items-center">
            <span className="text-sm text-stone-400">{planContent.length} 字</span>
            <button
              onClick={handleSubmit}
              className="btn-primary flex items-center gap-2"
              disabled={!groupName.trim() || !leaderName.trim() || !planContent.trim()}
            >
              <Send size={16} /> 提交方案
            </button>
          </div>
        </motion.div>
      )}

      {activeTab === 'review' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <div className="flex items-center gap-2">
            <Award className="text-primary-500" size={22} />
            <h3 className="text-lg font-semibold">方案评审结果</h3>
          </div>

          {plans.length === 0 ? (
            <div className="card text-center py-12 text-stone-400">
              暂无提交的方案，请先在"提交方案"标签页提交
            </div>
          ) : (
            plans.map(plan => (
              <div key={plan.id} className="card">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="font-semibold text-stone-800">{plan.groupName}</h4>
                    <p className="text-sm text-stone-500">组长：{plan.leaderName} · {new Date(plan.submittedAt).toLocaleString('zh-CN')}</p>
                  </div>
                  <div className="text-center">
                    <div className={`text-3xl font-bold ${(plan.score ?? 0) >= 80 ? 'text-green-600' : (plan.score ?? 0) >= 60 ? 'text-gold-500' : 'text-red-500'}`}>
                      {plan.score}
                    </div>
                    <div className="text-xs text-stone-400">综合评分</div>
                  </div>
                </div>

                <div className="bg-stone-50 rounded-xl p-4 mb-4 max-h-40 overflow-y-auto">
                  <p className="text-sm text-stone-600 whitespace-pre-line leading-relaxed">{plan.content}</p>
                </div>

                {plan.feedback && (
                  <div className="bg-blue-50 rounded-xl p-4">
                    <h5 className="font-medium text-blue-800 mb-2">评审反馈与改进建议</h5>
                    <p className="text-sm text-blue-700 whitespace-pre-line leading-relaxed">{plan.feedback}</p>
                  </div>
                )}
              </div>
            ))
          )}
        </motion.div>
      )}
    </div>
  )
}
