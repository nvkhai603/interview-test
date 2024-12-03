import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import './index.css'
import App from './App.jsx'
import { BrowserRouter, Routes, Route } from "react-router";
import CreateTreasureMap from './CreateTreasureMap';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/treasure-hunt" element={<CreateTreasureMap />} />
    </Routes>
  </BrowserRouter>,
)
