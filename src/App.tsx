import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { EntryForm } from './pages/EntryForm'
import { Dashboard } from './pages/Dashboard'

export const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<EntryForm />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  </BrowserRouter>
)
