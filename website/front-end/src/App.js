import React, { useState, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroller";
// import FetchMoreData from "./components/FetchMoreData";
import Axios from "axios";
import Main from "./components/Main";

import "./App.css";

function App() {
  const [cnnList, setCnnList] = useState([]);
  const [pageNum, setpageNum] = useState(1);
  const [hasMore, sethasMore] = useState(true);
  const [loaded, setLoaded] = useState(false);

  console.log(pageNum);

  const getQuery = () => {
    if (!loaded) {
      Axios.get(`http://localhost:3000/api/getCNN?page=${pageNum}`).then(
        (data) => {
          setCnnList(data.data);
          console.log("data");
        }
      );
      setLoaded(true);
    }
  };

  useEffect(() => {
    getQuery(pageNum);
  });

  const FetchMoreData = () => {
    if (cnnList.length >= 1000) {
      sethasMore(true);
      setpageNum(pageNum + 1);
      sethasMore(false);
    }
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
