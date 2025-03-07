import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/mode-toggle';
import { Globe, Upload, User } from 'lucide-react';
import { useAuth } from '@/features/auth';
import small_logo from '../../public/echolang-final.png';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <nav className="border-b">
      <div className="container flex items-center h-16 px-4 mx-auto max-w-7xl">
        <Link to="/" className="flex items-center space-x-2">
          <img src={small_logo} alt="EchoLang" className="h-10 w-22" />
        </Link>

        <div className="flex items-center ml-auto space-x-4">
          <ModeToggle />
          {isAuthenticated ? (
            <>
              {user?.role === 'customer' && (
                <>
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/upload">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload
                    </Link>
                  </Button>
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/dashboard">
                      <User className="w-4 h-4 mr-2" />
                      Dashboard
                    </Link>
                  </Button>
                </>
              )}
              {user?.role === 'admin' && (
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/admin/dashboard">
                    <User className="w-4 h-4 mr-2" />
                    Admin Dashboard
                  </Link>
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={logout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/login">Login</Link>
              </Button>
              <Button size="sm" asChild>
                <Link to="/signup">Sign Up</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}