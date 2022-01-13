import "./App.css";
import React, { useState, useRef, useCallback } from "react";
import FetchMoreData from "./hooks/FetchMoreData";

function App() {
  const [query, setQuery] = useState("");
  const [pageNum, setPageNum] = useState(1);

  const { isloading, data, hasMore, error } = FetchMoreData(pageNum, query);

  function handleSearch(e) {
    setQuery(e.target.value);
    setPageNum(1);
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
      <div className="grid grid-cols-5 gap-5 mt-4">
        {data.map((val, key) => {
          const sliceDate = val.date.slice(0, 10);
          if (val.imgalt === "undefined") {
            val.imgalt = "No image for this article";
            val.imglink = "#";
          }
          if (data.length === key + 1) {
            return (
              <div
                // ref={lastCnnElementRef}
                key={key}
                className="max-w-sm rounded overflow-hidden shadow-lg mb-4 card"
              >
                <a href={val.link}>
                  <img className="w-full" src={val.imglink} alt={val.imgalt} />
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
          } else {
            return (
              <div
                key={key}
                className="max-w-sm rounded overflow-hidden shadow-lg mb-4 card"
              >
                <a href={val.link}>
                  <img className="w-full" src={val.imglink} alt={val.imgalt} />
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
          }
        })}
      </div>
      <div>{isloading && "Loading..."}</div>
      <div>{error && "Error..."}</div>
    </>
  );
}

export default App;
