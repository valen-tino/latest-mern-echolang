import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './components/theme-provider';
import { Toaster } from 'sonner';
import { ProtectedRoute } from './features/auth/ProtectedRoute';
import Navbar from './components/Navbar';
import { Footer } from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard.tsx';
import Upload from './pages/Upload';
import VideoDetails from './pages/VideoDetails';

export default function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <Router>
        <div className="flex flex-col min-h-screen bg-background">
          <Navbar />
          <main className="container flex-1 px-4 mx-auto">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/upload" 
                element={
                  <ProtectedRoute>
                    <Upload />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/video/:id" 
                element={
                  <ProtectedRoute>
                    <VideoDetails />
                  </ProtectedRoute>
                } 
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
          <Toaster position="top-center" />
        </div>
      </Router>
    </ThemeProvider>
  );
}
