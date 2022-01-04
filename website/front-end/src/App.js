import "./App.css";
import React, { useState, useRef, useCallback } from "react";
import FetchMoreData from "./components/FetchMoreData";
import Marquee from "react-fast-marquee";

function App() {
  const [pageNum, setPageNum] = useState(1);

  const { isloading, data, hasMore } = FetchMoreData(pageNum);

  const observer = useRef();
  const lastCnnElementRef = useCallback(
    (node) => {
      if (isloading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPageNum((prevPageNum) => prevPageNum + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [isloading, hasMore]
  );

  return (
    <>
      <Marquee className="text-6xl">🚀💥CNN Archive💥🚀</Marquee>
      <hr />
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
                ref={lastCnnElementRef}
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
    </>
  );
}

export default App;
