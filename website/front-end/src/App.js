import React, { useState } from "react";
import InfiniteScroll from "react-infinite-scroller";
import FetchMoreData from "./components/FetchMoreData";
import Main from "./components/Main";

import "./App.css";

function App() {
  const [cnnList, setCnnList] = useState([]);

  return (
    <>
      <h1>🚀💥CNN Archive💥🚀</h1>
      <hr />
      <InfiniteScroll
        dataLength={cnnList.length}
        loadMore={FetchMoreData}
        hasMore={true}
        loader={<h2>Loading ...</h2>}
      >
        <Main cnnList={cnnList} setCnnList={setCnnList} />
      </InfiniteScroll>
    </>
  );
}

export default App;
