import { useMemo } from 'react'

interface WordCloudDisplayProps {
  words: string[]
  title: string
}

const STOP_WORDS = new Set(['的', '了', '是', '在', '我', '有', '和', '就', '不', '人', '都', '一', '一个', '上', '也', '很', '到', '说', '要', '去', '你', '会', '着', '没有', '看', '好', '自己', '这', '那', '什么', '关于', '最', '与', '及', '等', '对', '中', '为', '以', '而', '被', '从', '把', '让', '给', '能', '可以', '应该', '如何', '怎么', '哪些'])

const COLORS = ['#c41e3a', '#a01830', '#d4af37', '#7f1426', '#b8960c', '#5e0f1c', '#e85d5d', '#9b2335']

function extractKeywords(texts: string[]): { text: string; value: number }[] {
  const freq = new Map<string, number>()

  for (const text of texts) {
    if (!text.trim()) continue
    const segments = text
      .replace(/[，。！？、；：""''（）【】]/g, ' ')
      .split(/\s+/)
      .filter(w => w.length >= 2 && !STOP_WORDS.has(w))

    for (const word of segments) {
      freq.set(word, (freq.get(word) || 0) + 1)
    }

    const chars = text.replace(/[^\u4e00-\u9fff]/g, '')
    for (let i = 0; i < chars.length - 1; i++) {
      const bigram = chars.slice(i, i + 2)
      if (!STOP_WORDS.has(bigram)) {
        freq.set(bigram, (freq.get(bigram) || 0) + 1)
      }
    }
  }

  return Array.from(freq.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 30)
    .map(([text, value]) => ({ text, value }))
}

export default function WordCloudDisplay({ words, title }: WordCloudDisplayProps) {
  const cloudData = useMemo(() => extractKeywords(words), [words])
  const maxVal = cloudData[0]?.value ?? 1

  if (cloudData.length === 0) {
    return (
      <div className="card text-center py-12">
        <p className="text-stone-400 text-lg">暂无数据</p>
        <p className="text-stone-300 text-sm mt-2">提交问卷后将自动生成词云图</p>
      </div>
    )
  }

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-stone-700 mb-4 text-center">{title}</h3>
      <div className="min-h-[200px] flex flex-wrap items-center justify-center gap-3 p-4">
        {cloudData.map((word, i) => {
          const ratio = word.value / maxVal
          const fontSize = 12 + ratio * 28
          const opacity = 0.5 + ratio * 0.5
          return (
            <span
              key={i}
              style={{
                fontSize: `${fontSize}px`,
                color: COLORS[i % COLORS.length],
                opacity,
                fontWeight: ratio > 0.6 ? 700 : ratio > 0.3 ? 500 : 400,
                transform: `rotate(${((i * 7) % 5) - 2}deg)`,
              }}
              className="inline-block transition-transform hover:scale-110 cursor-default"
              title={`出现 ${word.value} 次`}
            >
              {word.text}
            </span>
          )
        })}
      </div>
      <p className="text-center text-stone-400 text-sm mt-2">基于 {words.length} 条回答生成</p>
    </div>
  )
}
