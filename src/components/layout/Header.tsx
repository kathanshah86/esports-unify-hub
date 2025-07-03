
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, User, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: 'Tournaments', href: '/tournaments' },
    { name: 'Leaderboards', href: '/leaderboards' },
    { name: 'Live Matches', href: '/live-matches' },
    { name: 'Wallet', href: '/wallet' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-gray-900/95 backdrop-blur-sm border-b border-purple-500/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img 
              src="/lovable-uploads/2aa9115f-ce05-4d8a-bab3-2cf4f362ef5e.png" 
              alt="Battle Mitra Logo" 
              className="w-12 h-12 object-contain"
            />
            <span className="text-white font-bold text-xl">Battle Mitra</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`transition-colors duration-200 ${
                  isActive(item.href)
                    ? 'text-purple-400 border-b-2 border-purple-400'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">
              <Search className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">
              Login
            </Button>
            <Button className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600">
              Sign Up
            </Button>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden text-gray-300"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-purple-500/20">
            <nav className="flex flex-col space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`px-3 py-2 rounded-md transition-colors duration-200 ${
                    isActive(item.href)
                      ? 'text-purple-400 bg-purple-500/10'
                      : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
