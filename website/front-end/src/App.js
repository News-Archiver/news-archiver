import React, { useState } from "react";
import InfiniteScroll from "react-infinite-scroller";
// import FetchMoreData from "./components/FetchMoreData";
import Main from "./components/Main";

import "./App.css";

function App() {
  const [cnnList, setCnnList] = useState([]);
  const [pageNum, setpageNum] = useState(1);
  const [hasMore, sethasMore] = useState(true);

  console.log(pageNum);

  const FetchMoreData = () => {
    if (cnnList.length >= 5000) {
      sethasMore(false);
    }
    setpageNum(pageNum + 1);
    return pageNum;
  };

  return (
    <>
      <h1>🚀💥CNN Archive💥🚀</h1>
      <hr />
      <InfiniteScroll
        dataLength={cnnList.length}
        loadMore={FetchMoreData}
        hasMore={hasMore}
        loader={<h2>Loading ...</h2>}
      >
        <Main cnnList={cnnList} setCnnList={setCnnList} pageNum={pageNum} />
      </InfiniteScroll>
    </>
  );
}

export default App;
