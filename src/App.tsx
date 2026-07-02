import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import PreClass from './pages/PreClass'
import InClass from './pages/InClass'
import PostClass from './pages/PostClass'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<PreClass />} />
        <Route path="in-class" element={<InClass />} />
        <Route path="post-class" element={<PostClass />} />
      </Route>
    </Routes>
  )
}
