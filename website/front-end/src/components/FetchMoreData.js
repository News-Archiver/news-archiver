import { useState } from "react";

const FetchMoreData = ({ cnnList, setCnnList }) => {
  const [stateList, setState] = useState([
    { cnnList: Array.from({ length: 20 }) },
  ]);

  setTimeout(() => {
    setState({
      items: stateList.cnnList.concat(Array.from({ length: 20 })),
    });
  }, 1500);

  return;
};

export default FetchMoreData;
