import { useState } from "react";

const FetchMoreData = () => {
  const [pageNum, setpageNum] = useState(1);
  setpageNum(pageNum + 1);
  console.log(pageNum);
  return pageNum;
};

export default FetchMoreData;
