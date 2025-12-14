import React, { useEffect, useState, useRef } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getEpisodes } from '../services/api';
import { ChevronLeft, ChevronRight, List } from 'lucide-react';

const Stream = () => {
    const { bookId, chapterId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const videoRef = useRef(null);

    const [episodes, setEpisodes] = useState(location.state?.episodes || []);
    const [currentChapterIndex, setCurrentChapterIndex] = useState(location.state?.currentChapterIndex || 0);
    const [loading, setLoading] = useState(true);
    const [videoUrl, setVideoUrl] = useState('');


    useEffect(() => {
        if (episodes.length === 0) {
            const fetchData = async () => {
                try {
                    const res = await getEpisodes(bookId);
                    setEpisodes(res.data);
                    const idx = res.data.findIndex(e => e.chapterId === chapterId);
                    if (idx !== -1) setCurrentChapterIndex(idx);
                } catch (error) {
                    console.error("Error loading episodes", error);
                } finally {
                    setLoading(false);
                }
            };
            fetchData();
        } else {
            setLoading(false);
        }
    }, [bookId]);


    useEffect(() => {
        if (episodes.length > 0 && currentChapterIndex >= 0 && currentChapterIndex < episodes.length) {
            const currentEp = episodes[currentChapterIndex];
            const cdn = currentEp.cdnList?.find(c => c.isDefault) || currentEp.cdnList?.[0];
            const videoPath = cdn?.videoPathList?.find(v => v.isDefault)?.videoPath || cdn?.videoPathList?.[0]?.videoPath;

            if (videoPath) {
                setVideoUrl(videoPath);
            }
        }
    }, [currentChapterIndex, episodes]);

    const handleNext = () => {
        if (currentChapterIndex < episodes.length - 1) {
            const nextIdx = currentChapterIndex + 1;
            const nextEp = episodes[nextIdx];
            setCurrentChapterIndex(nextIdx);
            navigate(`/stream/${bookId}/${nextEp.chapterId}`, { replace: true, state: { episodes, currentChapterIndex: nextIdx } });
        }
    };

    const handlePrev = () => {
        if (currentChapterIndex > 0) {
            const prevIdx = currentChapterIndex - 1;
            const prevEp = episodes[prevIdx];
            setCurrentChapterIndex(prevIdx);
            navigate(`/stream/${bookId}/${prevEp.chapterId}`, { replace: true, state: { episodes, currentChapterIndex: prevIdx } });
        }
    };

    const handleEnded = () => {
        if (currentChapterIndex < episodes.length - 1) {
            handleNext();
        }
    };

    return (
        <div className="min-h-screen bg-black flex flex-col">
            <Navbar />

            <div className="flex-1 flex flex-col lg:flex-row pt-20 container mx-auto px-4 lg:px-8 gap-6 pb-10">

                {}
                <div className="flex-1 w-full md:max-w-none max-w-sm mx-auto">
                    <div className="relative aspect-[9/16] md:aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl border border-white/10 ring-1 ring-white/5">
                        {loading ? (
                            <div className="absolute inset-0 flex items-center justify-center text-white">Loading Stream...</div>
                        ) : videoUrl ? (
                            <video
                                ref={videoRef}
                                src={videoUrl}
                                controls
                                autoPlay
                                className="w-full h-full object-contain"
                                onEnded={handleEnded}
                            />
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-gray-500">Video not available</div>
                        )}
                    </div>

                    <div className="mt-6 flex items-center justify-between">
                        <div>
                            <h1 className="text-xl md:text-2xl font-bold text-white mb-1">
                                Episode {currentChapterIndex + 1}
                            </h1>
                            <p className="text-gray-400 text-sm">{episodes[currentChapterIndex]?.chapterName || ""}</p>
                        </div>

                        <div className="flex space-x-4">
                            <button
                                onClick={handlePrev}
                                disabled={currentChapterIndex === 0}
                                className="p-3 rounded-full bg-surface hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronLeft className="w-6 h-6" />
                            </button>
                            <button
                                onClick={handleNext}
                                disabled={currentChapterIndex === episodes.length - 1}
                                className="p-3 rounded-full bg-primary hover:bg-primary-hover text-white disabled:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronRight className="w-6 h-6" />
                            </button>
                        </div>
                    </div>
                </div>

                {}
                <div className="w-full lg:w-96 bg-surface rounded-xl border border-white/5 p-4 flex flex-col h-[500px] lg:h-auto">
                    <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/5">
                        <h3 className="font-bold text-lg flex items-center"><List className="w-5 h-5 mr-2 text-primary" /> Episodes</h3>
                        <span className="text-xs text-gray-500">{episodes.length} Episodes</span>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-2">
                        {episodes.map((ep, idx) => (
                            <button
                                key={ep.chapterId}
                                onClick={() => {
                                    setCurrentChapterIndex(idx);
                                    navigate(`/stream/${bookId}/${ep.chapterId}`, { replace: true, state: { episodes, currentChapterIndex: idx } });
                                }}
                                className={`w-full flex items-center p-3 rounded-lg transition-all ${currentChapterIndex === idx ? 'bg-white/10 border-l-4 border-primary' : 'hover:bg-white/5 border-l-4 border-transparent'}`}
                            >
                                <div className="w-16 aspect-video bg-black rounded overflow-hidden mr-3 shrink-0 relative">
                                    {}
                                    {ep.chapterImg ? <img src={ep.chapterImg} className="w-full h-full object-cover" /> : null}
                                    {currentChapterIndex === idx && <div className="absolute inset-0 bg-black/60 flex items-center justify-center"><div className="w-2 h-2 bg-primary rounded-full animate-pulse" /></div>}
                                </div>
                                <div className="text-left overflow-hidden">
                                    <p className={`text-sm font-medium truncate ${currentChapterIndex === idx ? 'text-primary' : 'text-gray-300'}`}>Episode {idx + 1}</p>
                                    <p className="text-xs text-gray-500 truncate">{ep.chapterName}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Stream;
