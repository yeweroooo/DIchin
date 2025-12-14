import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getEpisodes, getDramaDetail } from '../services/api';
import { Play, Calendar, Star, Info, ChevronLeft } from 'lucide-react';

const Detail = () => {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();


    const [drama, setDrama] = useState(location.state?.drama || null);
    const [episodes, setEpisodes] = useState(location.state?.episodes || []);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {

                if (!drama || !drama.introduction) {
                    const detailRes = await getDramaDetail(id);
                    setDrama(prev => ({ ...prev, ...detailRes.data }));
                }

                if (episodes.length === 0) {
                    const res = await getEpisodes(id);
                    setEpisodes(res.data);
                }
            } catch (error) {
                console.error("Error fetching data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const handleEpisodeClick = (epIndex) => {
        const episode = episodes[epIndex];
        navigate(`/stream/${id}/${episode.chapterId}`, { state: { drama, episodes, currentChapterIndex: epIndex } });
    };

    if (loading && !drama) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    const displayDrama = drama || { bookName: "Loading...", coverWap: "", introduction: "" };

    return (
        <div className="min-h-screen bg-background text-white">
            <Navbar />

            {}
            <div className="relative min-h-[50vh] md:min-h-[85vh] flex items-end">
                <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${displayDrama.coverWap || displayDrama.cover})` }}>
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
                </div>

                <div className="container mx-auto px-4 md:px-8 relative z-10 pt-24 md:pt-32 pb-8 md:pb-12 w-full">
                    <div className="flex flex-col md:flex-row gap-8 w-full">
                        {}
                        <div className="w-32 md:w-60 aspect-[2/3] rounded-lg overflow-hidden shadow-2xl border-2 border-white/10 shrink-0 mx-auto md:mx-0">
                            <img src={displayDrama.coverWap || displayDrama.cover} alt={displayDrama.bookName} className="w-full h-full object-cover" />
                        </div>

                        {}
                        <div className="flex-1 text-center md:text-left">
                            <h1 className="text-2xl md:text-5xl font-bold mb-2 md:mb-4 leading-tight drop-shadow-md">{displayDrama.bookName}</h1>

                            {}
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-6 text-sm">
                                {displayDrama.tags && displayDrama.tags.length > 0 ? (
                                    displayDrama.tags.map(tag => (
                                        <span key={tag} className="bg-primary/20 text-primary px-3 py-1 rounded-full border border-primary/20 font-medium">
                                            {tag}
                                        </span>
                                    ))
                                ) : (
                                    <span className="text-gray-500 italic">No genres available</span>
                                )}
                            </div>

                            {}
                            {displayDrama.protagonist && (
                                <div className="mb-6">
                                    <span className="text-gray-400 text-sm uppercase tracking-wider block mb-1">Starring</span>
                                    <p className="text-white font-medium text-lg">{displayDrama.protagonist}</p>
                                </div>
                            )}

                            {}
                            <div className="flex items-center justify-center md:justify-start gap-4 mb-6 md:mb-8">
                                <button onClick={() => episodes.length > 0 && handleEpisodeClick(0)} className="bg-primary hover:bg-primary-hover text-white px-6 py-2.5 md:px-8 md:py-3 rounded-full font-bold transition-all shadow-[0_0_20px_rgba(168,85,247,0.4)] flex items-center hover:scale-105 active:scale-95 text-sm md:text-base">
                                    <Play className="w-5 h-5 mr-2 fill-current" /> Start Watching
                                </button>
                            </div>

                            {}
                            <div className="bg-white/5 rounded-xl p-6 border border-white/10 backdrop-blur-md">
                                <h3 className="text-lg font-bold text-white mb-2 flex items-center">
                                    <Info className="w-5 h-5 mr-2 text-primary" /> Synopsis
                                </h3>
                                <p className="text-gray-300 leading-relaxed text-sm md:text-base">
                                    {displayDrama.introduction || "No synopsis available for this drama."}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {}
            <div className="container mx-auto px-4 md:px-8 py-12">
                <div className="flex items-center mb-8">
                    <div className="w-1.5 h-8 bg-primary rounded-full mr-4"></div>
                    <h2 className="text-2xl font-bold text-white">Episodes <span className="text-gray-500 text-lg font-normal ml-2">({episodes.length})</span></h2>
                </div>

                {loading && episodes.length === 0 ? (
                    <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div></div>
                ) : (
                    <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2 md:gap-3">
                        {episodes.map((ep, idx) => (
                            <button
                                key={ep.chapterId}
                                onClick={() => handleEpisodeClick(idx)}
                                className="aspect-square rounded-xl bg-surface border border-white/10 hover:border-primary hover:bg-white/5 transition-all flex flex-col items-center justify-center group relative overflow-hidden"
                            >
                                <span className="text-lg font-bold text-gray-300 group-hover:text-primary z-10 transition-colors">{idx + 1}</span>
                                <span className="text-[10px] text-gray-600 uppercase tracking-wide mt-1 z-10">EP</span>
                                <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Detail;
