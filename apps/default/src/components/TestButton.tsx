import { useState } from 'react';

export function TestButton() {
  const [count, setCount] = useState(0);

  return (
    <div style={{ 
      position: 'fixed', 
      top: '20px', 
      left: '20px', 
      zIndex: 999999,
      background: 'red',
      padding: '20px',
      color: 'white'
    }}>
      <button
        onClick={() => {
          console.log('TEST BUTTON CLICKED!');
          setCount(count + 1);
          alert('Button works! Count: ' + (count + 1));
        }}
        style={{
          background: 'blue',
          color: 'white',
          padding: '10px 20px',
          border: 'none',
          cursor: 'pointer',
          fontSize: '16px'
        }}
      >
        TEST CLICK ME: {count}
      </button>
    </div>
  );
}
