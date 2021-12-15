import { useState } from "react";
import Axios from "axios";

const Main = ({ cnnList, setCnnList, pageNum }) => {
  // const [loaded, setLoaded] = useState(false);
  // const [pageNum, setpageNum] = useState(1);

  let temp = cnnList.map((val, key) => (
    <p key={val.id}>
      {key} {val.id} <a href={val.link}>{val.headline}</a>{" "}
    </p>
  ));
  return <>{temp}</>;
};

export default Main;
