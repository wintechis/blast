import React, {useRef, useEffect} from 'react';
import Output from './Output.jsx';
import Version from './Version.jsx';

const Controls = () => {
  const outputRef = useRef(null);

  useEffect(() => {
    globalThis['addMessage'] = outputRef.current.addMessage;
  }, []);

  return (
    <>
      <Output ref={outputRef} />
      <Version />
    </>
  );
};

export default Controls;
