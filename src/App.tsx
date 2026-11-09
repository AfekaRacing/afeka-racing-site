import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Tasks from './pages/Tasks'

// כרגע גלוי רק עמוד המשימות, וכל כתובת אחרת מובילה אליו. שאר העמודים נשארו בקוד, לא מחוברים.
// להחזרת האתר המלא: git revert ל-commit "Show only the tasks page", ודחיפה.
export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="tasks" element={<Tasks />} />
        <Route path="*" element={<Navigate to="/tasks" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
