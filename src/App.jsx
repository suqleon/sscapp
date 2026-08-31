import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppStateProvider, useAppState } from './context/AppState';
import { ToastProvider } from './components/Toast';
import OwnerEditor from './components/OwnerEditor';
import Login from './screens/Login';
import Home from './screens/Home';
import Book from './screens/Book';
import Schedule from './screens/Schedule';
import Progress from './screens/Progress';
import Payments from './screens/Payments';
import Messages from './screens/Messages';
import Notices from './screens/Notices';
import Profile from './screens/Profile';

function RequireAuth({ children }) {
  const { isAuthed } = useAppState();
  if (!isAuthed) return <Navigate to="/login" replace />;
  return children;
}

function Shell() {
  const { isAuthed } = useAppState();
  return (
    <>
      {isAuthed && <OwnerEditor />}
      <Routes>
        <Route path="/login" element={isAuthed ? <Navigate to="/" replace /> : <Login />} />
        <Route path="/" element={<RequireAuth><Home /></RequireAuth>} />
        <Route path="/reservar" element={<RequireAuth><Book /></RequireAuth>} />
        <Route path="/horario" element={<RequireAuth><Schedule /></RequireAuth>} />
        <Route path="/progreso" element={<RequireAuth><Progress /></RequireAuth>} />
        <Route path="/pagos" element={<RequireAuth><Payments /></RequireAuth>} />
        <Route path="/mensajes" element={<RequireAuth><Messages /></RequireAuth>} />
        <Route path="/avisos" element={<RequireAuth><Notices /></RequireAuth>} />
        <Route path="/perfil" element={<RequireAuth><Profile /></RequireAuth>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppStateProvider>
        <ToastProvider>
          <Shell />
        </ToastProvider>
      </AppStateProvider>
    </BrowserRouter>
  );
}
