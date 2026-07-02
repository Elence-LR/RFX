import { NavLink, Outlet } from 'react-router-dom'
import { BookOpen, Users, Sparkles, GraduationCap } from 'lucide-react'

const NAV_ITEMS = [
  { to: '/', label: '课前预习', icon: BookOpen, desc: '问卷 · 词云 · 学习' },
  { to: '/in-class', label: '课中实践', icon: Users, desc: '情景 · AI学伴 · 方案' },
  { to: '/post-class', label: '课后拓展', icon: Sparkles, desc: '美化 · 评价' },
]

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-gradient-to-r from-primary-700 via-primary-600 to-primary-500 text-white shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3 mb-4">
            <GraduationCap size={32} className="text-gold-400" />
            <div>
              <h1 className="text-xl font-serif font-bold tracking-wide">思政教育评估标准学习平台</h1>
              <p className="text-primary-100 text-sm">思想政治教育评估标准 · 课前 · 课中 · 课后</p>
            </div>
          </div>
          <nav className="flex gap-2">
            {NAV_ITEMS.map(({ to, label, icon: Icon, desc }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-white/20 backdrop-blur-sm shadow-inner'
                      : 'hover:bg-white/10'
                  }`
                }
              >
                <Icon size={18} />
                <div>
                  <div>{label}</div>
                  <div className="text-xs text-primary-200 font-normal">{desc}</div>
                </div>
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8">
        <Outlet />
      </main>

      <footer className="text-center text-stone-400 text-sm py-6 border-t border-stone-100">
        思政教育评估标准学习平台 · 跨学科融合教学
      </footer>
    </div>
  )
}
