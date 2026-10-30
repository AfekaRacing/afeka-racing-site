import { MotionConfig } from 'motion/react'
import { lazy } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import Home from './pages/Home'
import { Gallery, Join, NotFound } from './pages/stubs'

const About = lazy(() => import('./pages/About'))
const Projects = lazy(() => import('./pages/Projects'))
const Belgium = lazy(() => import('./pages/Belgium'))
const Orna = lazy(() => import('./pages/Orna'))

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="orna" element={<Orna />} />
            <Route path="projects" element={<Projects />} />
            <Route path="belgium" element={<Belgium />} />
            <Route path="gallery" element={<Gallery />} />
            <Route path="join" element={<Join />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </MotionConfig>
  )
}
