import { Routes, Route } from 'react-router';
import Series from './pages/Series';
import NavBar from './components/NavBar';
import Home from './pages/Home';
import Actors from './pages/Actors';
import { useEffect } from 'react';
import { StorageService } from './services/storage';

function App() {
    useEffect(() => {
        StorageService.loadInitData();

        const btn = document.querySelector('.mobile-menu-button');
        const menu = document.querySelector('.mobile-menu');

        btn?.addEventListener('click', () => {
            menu?.classList.toggle('hidden');
        });
    }, []);

    return (
        <div className="min-h-screen bg-gray-50">
            <NavBar />
            <main className="py-8">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/actors/*" element={<Actors />} />
                    <Route path="/series/*" element={<Series />} />
                </Routes>
            </main>
        </div>
    );
}

export default App;
