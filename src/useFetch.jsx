// src/useFetch.js
import { useState, useEffect } from 'react';

function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Reset state when URL changes
    setData(null);
    setLoading(true);
    setError(null);

    // Create an AbortController to cancel the request if the component
    // unmounts or the URL changes before the request finishes
    const controller = new AbortController();

    fetch(url, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error. Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((err) => {
        // Ignore abort errors — they happen on purpose
        if (err.name !== 'AbortError') {
          setError(err.message);
          setLoading(false);
        }
      });

    // Cleanup: cancel the request
    return () => {
      controller.abort();
    };
  }, [url]);

  return { data, loading, error };
}

export default useFetch;