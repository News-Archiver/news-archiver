import "./App.css";
import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
    const [data, setData] = useState([]);
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [query, setQuery] = useState("");

    useEffect(() => {
        const loadUsers = async () => {
            try {
                setIsLoading(true);
                const response = await axios.get(
                    `https://newsarchiverdiff.com/api/getCNN?page=${page}&q=${query}`
                );
                if (page > 1) {
                    setData((data) => [...data, ...response.data]);
                } else {
                    setData((data) => [...response.data]);
                }
            } catch (error) {
                setErrorMsg("Error while loading data. Try again later.");
            } finally {
                setIsLoading(false);
            }
        };

        loadUsers();
    }, [page, query]);

    const loadMore = () => {
        setPage((page) => page + 1);
    };

    function handleSearch(e) {
        setQuery(e.target.value);
        setPage(1);
    }

    return (
        <>
            <input
                type="text"
                className="
        form-control
        block
        w-full
        px-3
        py-1.5
        text-base
        font-normal
        text-gray-700
        bg-white bg-clip-padding
        border border-solid border-gray-300
        rounded
        transition
        ease-in-out
        m-0
        focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none
      "
                placeholder="Search"
                onChange={handleSearch}
                value={query}
            />
            <div className="grid grid-cols-4 gap-5 mt-4">
                {data.map((val, key) => {
                    const sliceDate = val.date.slice(0, 10);
                    if (val.imgalt === "undefined") {
                        val.imgalt = "No image for this article";
                        val.imglink = "#";
                    }
                    return (
                        <div
                            key={key}
                            className="max-w-sm rounded overflow-hidden shadow-lg mb-4 card"
                        >
                            <a href={val.link}>
                                <img
                                    className="w-full"
                                    src={val.imglink}
                                    alt={val.imgalt}
                                />
                            </a>
                            <div className="px-6 py-4">
                                <div className="font-bold text-xl mb-2">
                                    <a href={val.link}>{val.headline}</a>
                                </div>
                            </div>
                            <div className="px-6 pt-4 pb-2">
                                <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                                    {sliceDate}
                                </span>
                                <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                                    {val.month}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
            {errorMsg && <p>{errorMsg}</p>}
            <button
                onClick={loadMore}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
            >
                {isLoading ? "Loading..." : "Load More"}
            </button>
        </>
    );
}

export default App;
