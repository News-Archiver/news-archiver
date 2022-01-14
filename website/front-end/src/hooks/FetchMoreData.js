import { useState, useEffect } from "react";
import axios from "axios";

const FetchMoreData = (pageNum, query) => {
  const [isloading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(false);
  const [data, setData] = useState([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    // setData([]);
  }, [query]);

  useEffect(() => {
    setLoading(true);
    setError(false);
    let cancel;
    axios({
      method: "GET",
      url: "http://localhost:3000/api/getCNN",
      params: { page: pageNum, q: query },
      cancelToken: new axios.CancelToken((c) => (cancel = c)),
    })
      .then((res) => {
        if (query === "") {
          setData((prevCnnList) => {
            return [...new Set([...prevCnnList, ...res.data])];
          });
          setHasMore(res.data.length > 0);
          setLoading(false);
        } else {
          setData((prevCnnList) => {
            return [...res.data];
          });
          setHasMore(res.data.length > 0);
          setLoading(false);
        }
      })
      .catch((e) => {
        if (axios.isCancel(e)) return;
        setError(true);
      });
    return () => cancel();
  }, [pageNum, query]);

  return { isloading, data, hasMore, error };
};

export default FetchMoreData;
