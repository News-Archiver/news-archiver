import { useState, useEffect } from "react";
import axios from "axios";

const FetchMoreData = (pageNum, query) => {
  const [isloading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(false);
  const [data, setData] = useState([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    setData([])
  }, [query])

  useEffect(() => {
    let cancel;
    let delay = setTimeout(() => {console.log("here"); console.log(setLoading(true))}, 2000)
    setError(false);
    axios({
      method: "GET",
      url: "http://localhost:3000/api/getCNN",
      params: { page: pageNum, q: query },
      cancelToken: new axios.CancelToken((c) => (cancel = c)),
    })
      .then((res) => {
        console.log(res.data);
        console.log(query);
        setData((prevCnnList) => {
          return [...prevCnnList, ...res.data];
        });
        setHasMore(res.data.length > 0);
        clearTimeout(delay);
        setLoading(false);
      })
      .catch((e) => {
        if (axios.isCancel(e)) {
          clearTimeout(delay);
          setLoading(false);
          return
        }
        setError(true);
      });
    return () => cancel();
  }, [pageNum, query]);

  return { isloading, data, hasMore, error };
};

export default FetchMoreData;
