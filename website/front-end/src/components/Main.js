import { useState, useEffect } from "react";
import Axios from "axios";

const Main = () => {
  const [cnnList, setCnnList] = useState([]);

  useEffect(() => {
    Axios.get("http://localhost:3000/api/getCNN").then((data) => {
      setCnnList(data.data);
    });
  }, []);

  // let cnnList = ["hello", "yo", "hi"];
  return (
    <>
      {cnnList.map((val, key) => (
        <li key={key}>{val}</li>
      ))}
    </>
  );
};

export default Main;
