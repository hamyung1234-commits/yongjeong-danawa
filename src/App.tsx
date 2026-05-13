import { Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import FoodPage from './pages/FoodPage';
import TravelPage from './pages/TravelPage';
import DajungPage from './pages/DajungPage';
import DanaPage from './pages/DanaPage';
import CouplePage from './pages/CouplePage';

export default function App() {
  return (
    <AppProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/food" element={<FoodPage />} />
          <Route path="/travel" element={<TravelPage />} />
          <Route path="/dajung" element={<DajungPage />} />
          <Route path="/dana" element={<DanaPage />} />
          <Route path="/couple" element={<CouplePage />} />
        </Route>
      </Routes>
    </AppProvider>
  );
}
