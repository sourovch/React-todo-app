import { useState, useEffect } from 'react';

const useDebaunce = (value, debaunce) => {
  const [debaunceValue, setDebaunceValue] = useState(value);

  useEffect(() => {
    const timeOutKey = setTimeout(() => {
      setDebaunceValue(value);
    }, debaunce);

    return () => {
      clearTimeout(timeOutKey);
    };
  }, [value]);

  return debaunceValue;
};

export default useDebaunce;
