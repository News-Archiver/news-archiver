import React, { Suspense, useState } from "react";
import InfiniteScroll from "react-infinite-scroller";

import "./App.css";

const FetchMoreData = React.lazy(() => import("./components/FetchMoreData"));
const Main = React.lazy(() => import("./components/Main"));

function App() {
  const [cnnList, setCnnList] = useState([]);
  return (
    <>
      <Suspense fallback={<h1>Loading...</h1>}>
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
      </Suspense>
    </>
  );
}

export default App;
