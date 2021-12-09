import { useState, useEffect } from "react";
import Axios from "axios";

const Main = () => {
  const [cnnList, setCnnList] = useState([]);
  const [loaded, setLoaded] = useState(false);
  
  
  if(!loaded) {
    Axios.get("http://localhost:3000/api/getCNN").then((data) => {
      setCnnList(data.data);
    });
    setLoaded(true);
  }
  // let cnnList = [{"id":60992,"headline":"Is this the end of the Tiger Woods era?","link":"https://edition.cnn.com/2021/12/01/golf/tiger-woods-end-of-era-meanwhile-spt-intl/index.html","date":"2021-11-30T17:00:00.000Z","month":"December"}]
  let temp = cnnList.map((val, key) => <li key={val.id}>{val.headline}</li> );
  return (
    <>
      {temp}
    </>
  );
};



export default Main;
