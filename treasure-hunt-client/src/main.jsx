import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/be-vietnam-pro';
import './index.css'
import App from './App.jsx'
import { BrowserRouter, Routes, Route } from "react-router";
import CreateTreasureMapPage from './CreateTreasureMapPage.jsx';
import TreasureHuntDetailPage from './TreasureHuntDetailPage.jsx';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <div className="bg-zinc-100">
      <div className="bg-white w-full max-w-3xl mx-auto">
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/treasure-hunt" element={<CreateTreasureMapPage />} />
          <Route path="/treasure-hunt/:id" element={<TreasureHuntDetailPage />} />
        </Routes>
      </div>
    </div>
  </BrowserRouter>,
)
