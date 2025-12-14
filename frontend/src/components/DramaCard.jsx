import React from 'react';
import { Link } from 'react-router-dom';
import { Play } from 'lucide-react';

const DramaCard = ({ drama }) => {
    return (
        <Link to={`/detail/${drama.bookId}`} state={{ drama }} className="group relative block w-full aspect-[3/4] rounded-xl overflow-hidden bg-surface transition-all duration-300 hover:scale-[1.02] active:scale-95 hover:ring-2 hover:ring-primary hover:shadow-[0_0_15px_rgba(168,85,247,0.4)]">
            {/* Image */}
            <img
                src={drama.coverWap || drama.cover}
                alt={drama.bookName}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90 transition-opacity" />

            {/* Content */}
            <div className="absolute bottom-0 left-0 w-full p-2 md:p-3 bg-gradient-to-t from-black/80 via-black/40 to-transparent pt-6">
                <h3 className="text-white font-bold text-xs md:text-sm leading-tight line-clamp-2 drop-shadow-md">{drama.bookName}</h3>
            </div>

            {/* Play Icon Layer */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="bg-primary/90 rounded-full p-3 backdrop-blur-sm shadow-lg transform scale-50 group-hover:scale-100 transition-transform">
                    <Play className="w-6 h-6 text-white fill-current" />
                </div>
            </div>
        </Link>
    );
};

export default DramaCard;
