import React, { useState, useRef, useCallback } from "react";
import FetchMoreData from "./components/FetchMoreData";

import "./App.css";

function App() {
  const [pageNum, setPageNum] = useState(1);

  const { loading, cnnList, hasMore } = FetchMoreData(pageNum);

  const observer = useRef();
  const lastCnnElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPageNum((prevPageNum) => prevPageNum + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  return (
    <>
      <h1>🚀💥CNN Archive💥🚀</h1>
      <hr />
      {cnnList.map((val, key) => {
        if (cnnList.length === key + 1) {
          return (
            <p ref={lastCnnElementRef} key={key}>
              <a href={val.link}>{val.headline}</a>
            </p>
          );
        } else {
          return (
            <p key={key}>
              <a href={val.link}>{val.headline}</a>
            </p>
          );
        }
      })}
      <div>{loading && "Loading..."}</div>
    </>
  );
}

export default App;
