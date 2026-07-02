import { useState, useRef, useEffect } from 'react'
import { Send, BookMarked, Globe } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import XiaosiAvatar from './XiaosiAvatar'
import { AI_KNOWLEDGE, AI_RESPONSES } from '../data/content'
import { storage } from '../utils/storage'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
}

const QUICK_TOPICS = ['美国', '英国', '德国', '日本', '第三方评估', '差异化标准', '跨学科融合']

function generateResponse(input: string): string {
  for (const [key, value] of Object.entries(AI_KNOWLEDGE)) {
    if (key !== 'default' && input.includes(key)) return value
  }
  for (const [key, value] of Object.entries(AI_RESPONSES)) {
    if (key !== 'default' && input.includes(key)) return value
  }
  return AI_KNOWLEDGE.default
}

export default function AICompanion() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      role: 'assistant',
      content: '你好！我是AI学伴小思 👋\n\n我可以帮你收集各国思政教育评估的成功经验，也可以解答关于评估标准改革的问题。\n\n试试点击下方快捷话题，或直接输入你的问题吧！',
      timestamp: Date.now(),
    },
  ])
  const [input, setInput] = useState('')
  const [talking, setTalking] = useState(false)
  const [collected, setCollected] = useState(storage.getCollected())
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = (text: string) => {
    if (!text.trim()) return

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: text, timestamp: Date.now() }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setTalking(true)

    setTimeout(() => {
      const response = generateResponse(text)
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: Date.now(),
      }
      setMessages(prev => [...prev, aiMsg])
      setTalking(false)
    }, 800 + Math.random() * 700)
  }

  const collectInfo = (content: string) => {
    const country = ['美国', '英国', '德国', '日本', '法国'].find(c => content.includes(c)) || '综合'
    storage.addCollected({
      id: Date.now().toString(),
      country,
      content: content.slice(0, 200),
      timestamp: Date.now(),
    })
    setCollected(storage.getCollected())
  }

  return (
    <div className="card flex flex-col h-[600px]">
      <div className="flex items-center gap-4 pb-4 border-b border-stone-100">
        <XiaosiAvatar size="sm" talking={talking} />
        <div>
          <h3 className="font-semibold text-stone-800">AI学伴 · 小思</h3>
          <p className="text-sm text-stone-500">收集各国评估标准成功经验</p>
        </div>
        {collected.length > 0 && (
          <div className="ml-auto flex items-center gap-1 text-sm text-primary-500">
            <BookMarked size={16} />
            已收集 {collected.length} 条
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto py-4 space-y-4">
        <AnimatePresence>
          {messages.map(msg => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                msg.role === 'user'
                  ? 'bg-primary-500 text-white rounded-br-md'
                  : 'bg-stone-100 text-stone-700 rounded-bl-md'
              }`}>
                <p className="text-sm whitespace-pre-line leading-relaxed">{msg.content}</p>
                {msg.role === 'assistant' && msg.id !== '0' && (
                  <button
                    onClick={() => collectInfo(msg.content)}
                    className="mt-2 text-xs flex items-center gap-1 text-primary-500 hover:text-primary-600 transition-colors"
                  >
                    <Globe size={12} /> 收藏此条经验
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>

      <div className="flex flex-wrap gap-2 pb-3">
        {QUICK_TOPICS.map(topic => (
          <button
            key={topic}
            onClick={() => sendMessage(`${topic}的评估标准是怎样的？`)}
            className="text-xs px-3 py-1.5 rounded-full bg-stone-100 hover:bg-primary-50 hover:text-primary-600 text-stone-600 transition-colors"
          >
            {topic}
          </button>
        ))}
      </div>

      <div className="flex gap-2 pt-3 border-t border-stone-100">
        <input
          className="input-field flex-1 !py-2.5"
          placeholder="输入问题，如：如何引入第三方评估？"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage(input)}
        />
        <button onClick={() => sendMessage(input)} className="btn-primary !px-4">
          <Send size={18} />
        </button>
      </div>
    </div>
  )
}
