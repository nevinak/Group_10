import { Navigate, Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './components/Login';
import Signup from './components/Signup';
import Home from './home/Home';
import Loading from './components/Loading';
import { useAuth } from './context/AuthProvider';

const ProtectedRoute = ({ children }) => {
  const { authUser, loading } = useAuth();

  if (loading) return <Loading />;
  if (!authUser) return <Navigate to="/login" replace />;
  return children;
};

const PublicRoute = ({ children }) => {
  const { authUser, loading } = useAuth();

  if (loading) return <Loading />;
  if (authUser) return <Navigate to="/" replace />;
  return children;
};

function App() {
  return (
    <>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
      </Routes>
    </>
  );
}

export default App;
