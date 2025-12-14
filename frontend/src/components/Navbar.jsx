import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 0) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
            setIsMobileMenuOpen(false);
        }
    };

    return (
        <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-black/95 border-b border-primary/50 shadow-lg py-3' : 'bg-gradient-to-b from-black to-transparent py-5'}`}>
            <div className="container mx-auto px-4 md:px-8 flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="text-xl md:text-2xl font-black text-white tracking-wide">
                    DiChin
                </Link>

                {/* Search Bar */}
                <div className="flex items-center">
                    <form onSubmit={handleSearch} className="relative">
                        <input
                            type="text"
                            placeholder="Search Drama"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-white/10 hover:bg-white/20 border border-transparent hover:border-white/10 rounded-lg py-1.5 px-4 pl-10 text-sm focus:outline-none focus:bg-black transition-all w-32 md:w-64 text-gray-300 placeholder-gray-500"
                        />
                        <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                    </form>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
