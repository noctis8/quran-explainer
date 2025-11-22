import './global.css'
import './font.css'
import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import GoUp from './components/ui/GoUp.jsx'

// Lazy load pages
const Home = lazy(() => import('./pages/Home'))
const Quran = lazy(() => import('./pages/Quran'))

// Loading component
const PageLoader = () => (
    <div className="flex items-center justify-center min-h-screen !bg-[var(--bg)]">
        <div className=" text-gray-700 mr-4">Loading </div>
        <div className="loader"></div>
    </div>
)

// TODO: 
// - add chapter info

function App() {
    return (
        <BrowserRouter>
            <Suspense fallback={<PageLoader />}>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/quran" element={<Quran />} />
                </Routes>
            </Suspense>
            <GoUp />
        </BrowserRouter>
    )
}

export default App