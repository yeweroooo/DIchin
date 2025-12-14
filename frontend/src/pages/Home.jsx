import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Loader, Play, Info } from 'lucide-react';
import Navbar from '../components/Navbar';
import DramaCard from '../components/DramaCard';
import { getTrending, getForYou, getNew } from '../services/api';

const Section = ({ title, dramas }) => {
    return (
        <div className="mb-12">
            <div className="flex items-center mb-6">
                <div className="w-1.5 h-6 bg-primary rounded-full mr-3"></div>
                <h2 className="text-xl md:text-2xl font-bold uppercase tracking-wide">{title}</h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-6">
                {dramas.map((drama) => (
                    <DramaCard key={drama.bookId || drama.id || Math.random()} drama={drama} />
                ))}
            </div>
        </div>
    );
};

const HeroSlider = ({ items }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % Math.min(items.length, 5));
        }, 5000);
        return () => clearInterval(interval);
    }, [items]);

    if (!items || items.length === 0) return null;

    return (
        <div className="relative w-full max-w-7xl mx-auto mb-16 px-4 md:px-8 pt-8">
            <div className="relative w-full aspect-[3/4] sm:aspect-[4/5] md:aspect-[21/9] rounded-2xl md:rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] bg-surface group border border-white/5">
                {items.slice(0, 5).map((item, index) => (
                    <div
                        key={item.bookId}
                        className={`absolute inset-0 transition-all duration-700 ease-in-out ${index === currentIndex ? 'opacity-100 z-10 scale-100' : 'opacity-0 z-0 scale-95'}`}
                    >
                        {/* Blurred Background Layer */}
                        <div
                            className="absolute inset-0 bg-cover bg-center blur-3xl opacity-50 transform scale-110"
                            style={{ backgroundImage: `url(${item.coverWap || item.cover})` }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-[#0f0f0f] via-[#0f0f0f]/80 to-transparent" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-[#0f0f0f]/50 to-transparent" />

                        {/* Main Content Grid */}
                        <div className="absolute inset-0 flex flex-col items-center justify-end md:justify-start md:flex-row p-6 pb-20 md:p-12 gap-6 md:gap-12 text-center md:text-left">

                            {/* Card-in-Card Thumbnail (The "inner" card) */}
                            <div className="relative w-28 sm:w-44 md:w-64 flex-shrink-0 animate-fadeIn delay-100 mb-4 md:mb-0">
                                <div className="aspect-[2/3] rounded-xl overflow-hidden shadow-[0_0_20px_rgba(168,85,247,0.3)] border border-white/10 ring-1 ring-white/20 transform md:rotate-[-3deg] hover:rotate-0 transition-transform duration-500 bg-surface">
                                    <img
                                        src={item.cover || item.coverWap || "https://via.placeholder.com/300x450?text=No+Cover"}
                                        alt={item.bookName}
                                        className="w-full h-full object-cover"
                                        onError={(e) => { e.target.src = "https://via.placeholder.com/300x450?text=No+Cover" }}
                                    />
                                </div>
                                {/* Reflection/Glow effect behind */}
                                <div className="absolute -inset-4 bg-primary/20 blur-2xl -z-10 rounded-full opacity-60"></div>
                            </div>

                            {/* Text Content */}
                            <div className="flex-1 w-full md:w-auto z-10 flex flex-col items-center md:items-start justify-end md:justify-center h-auto md:h-full">
                                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 md:gap-3 mb-3 md:mb-4 animate-fadeIn">
                                    <span className="bg-primary/90 text-white text-xs font-bold px-3 py-1 rounded-md uppercase tracking-wider shadow-lg shadow-primary/20">
                                        Trending #{index + 1}
                                    </span>
                                    {item.tags && item.tags[0] && (
                                        <span className="bg-white/5 backdrop-blur-md text-gray-200 text-xs font-medium px-3 py-1 rounded-md border border-white/10 uppercase tracking-wider">
                                            {item.tags[0]}
                                        </span>
                                    )}
                                </div>

                                <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-2 md:mb-4 leading-tight tracking-tight drop-shadow-xl animate-slideUp font-display line-clamp-2">
                                    {item.bookName}
                                </h2>

                                <p className="text-gray-300 line-clamp-2 md:line-clamp-3 text-xs md:text-lg max-w-2xl mb-4 md:mb-8 leading-relaxed opacity-0 animate-fadeIn delay-200 font-light" style={{ animationFillMode: 'forwards' }}>
                                    {item.introduction}
                                </p>

                                <div className="flex items-center space-x-3 md:space-x-4 opacity-0 animate-fadeIn delay-300" style={{ animationFillMode: 'forwards' }}>
                                    <Link
                                        to={`/detail/${item.bookId}`}
                                        state={{ drama: item }}
                                        className="bg-primary hover:bg-primary-hover text-white px-5 py-2.5 md:px-8 md:py-4 rounded-xl font-bold transition-all shadow-[0_0_25px_rgba(168,85,247,0.4)] flex items-center gap-2 md:gap-3 hover:scale-105 active:scale-95 group/btn text-sm md:text-base"
                                    >
                                        <div className="bg-white/20 rounded-full p-1 transition-colors group-hover/btn:bg-white/30">
                                            <Play className="w-3 h-3 md:w-4 md:h-4 fill-current ml-0.5" />
                                        </div>
                                        <span>Watch Now</span>
                                    </Link>
                                    <button className="bg-white/5 hover:bg-white/10 backdrop-blur-md text-white px-4 py-2.5 md:px-6 md:py-4 rounded-xl font-medium transition-all flex items-center gap-2 border border-white/10 hover:border-white/20 text-sm md:text-base">
                                        <Info className="w-4 h-4 md:w-5 md:h-5" />
                                        <span>Details</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination Dots */}
            <div className="absolute bottom-12 right-12 z-20 flex space-x-3">
                {items.slice(0, 5).map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setCurrentIndex(idx)}
                        className={`transition-all duration-300 rounded-full ${idx === currentIndex ? 'w-6 md:w-8 bg-primary h-1.5 md:h-2 shadow-lg shadow-primary/50' : 'w-1.5 md:w-2 bg-white/20 h-1.5 md:h-2 hover:bg-white/40'}`}
                        aria-label={`Go to slide ${idx + 1}`}
                    />
                ))}
            </div>
        </div>
    );
};

const Home = () => {
    const [trending, setTrending] = useState([]);
    const [foryou, setForyou] = useState([]);
    const [newList, setNewList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [trendingRes, foryouRes, newRes] = await Promise.all([
                    getTrending(),
                    getForYou(),
                    getNew()
                ]);
                setTrending(trendingRes.data);

                // Normalizing For You data
                const normalizedForYou = Array.isArray(foryouRes.data)
                    ? foryouRes.data.flatMap(item => item?.tagCardVo?.tagBooks || [])
                    : [];
                setForyou(normalizedForYou);

                setNewList(newRes.data);
            } catch (error) {
                console.error("Failed to fetch data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Loader className="w-10 h-10 text-primary animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-white">
            <Navbar />

            {/* Main Content Wrapper with Top Padding for Fixed Navbar */}
            <div className="pt-24 pb-20">
                {/* Hero Section */}
                <HeroSlider items={trending} />

                {/* Content Sections */}
                <div className="max-w-6xl mx-auto px-4 md:px-8 space-y-12">

                    {/* For You Section */}
                    {foryou.length > 0 && (
                        <section>
                            <div className="flex items-center mb-6">
                                <div className="w-1.5 h-6 bg-primary rounded-full mr-3"></div>
                                <h2 className="text-xl md:text-2xl font-bold uppercase tracking-wide">For You</h2>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-6">
                                {foryou.slice(0, 10).map((drama) => (
                                    <DramaCard key={drama.bookId || drama.id} drama={drama} />
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Trending Section - Vertical List or Grid */}
                    {trending.length > 0 && (
                        <Section title="Trending Now" dramas={trending} />
                    )}

                    {/* New Releases Section */}
                    {newList.length > 0 && (
                        <Section title="New Releases" dramas={newList} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default Home;
