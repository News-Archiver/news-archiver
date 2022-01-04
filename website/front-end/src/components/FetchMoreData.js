import { useState, useEffect } from "react";
import axios from "axios";

const FetchMoreData = (pageNum) => {
  const [isloading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`http://localhost:3000/api/getCNN?page=${pageNum}`)
      .then((res) => {
        setData((prevCnnList) => {
          return [...prevCnnList, ...res.data];
        });
        setHasMore(res.data.length > 0);
        setLoading(false);
      });
  }, [pageNum]);

  return { isloading, data, hasMore };
};

export default FetchMoreData;
