import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Events from './pages/Events';
import CartPage from './pages/CartPage';
import Feedback from './pages/Feedback';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="events" element={<Events />} />
        <Route path="cart" element={<CartPage />} />
        <Route path='feedback' element={<Feedback />} />
      </Route>
    </Routes>
  );
}
