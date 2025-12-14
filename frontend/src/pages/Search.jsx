import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import DramaCard from '../components/DramaCard';
import { search, getPopularSearch } from '../services/api';
import { Search as SearchIcon } from 'lucide-react';

const Search = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q');

    const [results, setResults] = useState([]);
    const [popular, setPopular] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getPopularSearch().then(res => setPopular(res.data)).catch(err => console.error(err));
    }, []);

    useEffect(() => {
        if (query) {
            setLoading(true);
            search(query)
                .then(res => setResults(res.data))
                .catch(err => console.error(err))
                .finally(() => setLoading(false));
        } else {
            setResults([]);
        }
    }, [query]);

    return (
        <div className="min-h-screen bg-background pb-20">
            <Navbar />

            <div className="container mx-auto px-4 md:px-8 pt-32">

                {query ? (
                    <>
                        <h1 className="text-2xl font-bold mb-8 flex items-center">
                            <SearchIcon className="mr-3 text-primary" />
                            Search Results for <span className="text-primary italic ml-2">"{query}"</span>
                        </h1>

                        {loading ? (
                            <div className="text-center py-20 text-gray-400">Searching...</div>
                        ) : results.length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                                {results.map(drama => (
                                    <DramaCard key={drama.bookId} drama={drama} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 text-gray-500">
                                <p className="text-xl">No results found.</p>
                                <p className="text-sm mt-2">Try checking your spelling or search for something else.</p>
                            </div>
                        )}
                    </>
                ) : (
                    <>
                        <h1 className="text-2xl font-bold mb-8 text-white">Popular Searches</h1>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                            {popular.map(drama => (
                                <DramaCard key={drama.bookId} drama={drama} />
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Search;
