import { useState, useEffect } from "react";
import axios from "axios";

const FetchMoreData = (pageNum) => {
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(false);
  const [cnnList, setCnnList] = useState([]);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`http://localhost:3000/api/getCNN?page=${pageNum}`)
      .then((res) => {
        setCnnList((prevCnnList) => {
          return [...prevCnnList, ...res.data];
        });
        setHasMore(res.data.length > 0);
        setLoading(false);
      });
  }, [pageNum]);

  return { loading, cnnList, hasMore };
};

export default FetchMoreData;
