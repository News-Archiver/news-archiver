import { useState } from "react";
import Axios from "axios";

const Main = () => {
  const [cnnList, setCnnList] = useState([]);
  const [loaded, setLoaded] = useState(false);

  if (!loaded) {
    Axios.get("http://localhost:3000/api/getCNN").then((data) => {
      setCnnList(data.data);
    });
    setLoaded(true);
  }
  let temp = cnnList.map((val, key) => (
    <p>
      {val.date} <a href={val.link}>{val.headline}</a>
    </p>
  ));
  return <>{temp}</>;
};

export default Main;
