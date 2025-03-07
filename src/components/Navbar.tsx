import { Link } from 'react-router-dom';
import { Button } from './ui/button';

export default function Navbar() {
  return (
    <nav className="w-full border-b">
      <div className="container flex h-16 items-center justify-between px-4">
        <Link to="/" className="text-xl font-bold">
          VideoTranslate
        </Link>
        <div className="flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link to="/login">Login</Link>
          </Button>
          <Button asChild>
            <Link to="/signup">Sign Up</Link>
          </Button>
        </div>
      </div>
    </nav>
  );
}
