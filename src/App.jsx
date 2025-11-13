import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import InterviewTips from './pages/InterviewTips';
import ResumeBuilder from './pages/ResumeBuilder';
import TemplateSelector from './pages/TemplateSelector';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/interview-tips" element={<InterviewTips />} />
        <Route path="/resume-builder" element={<ResumeBuilder />} />
        <Route path="/template-selector" element={<TemplateSelector />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;