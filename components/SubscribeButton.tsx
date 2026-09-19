import React from 'react';

const Button = () => {
  return (
    <div style={wrapperStyle}>
      <button className="styled-button font-sans" >
        <p className='font-sans !text-purple-400'>Subscribe</p>
        <svg 
          xmlns="http://www.w3.org/2000/svg"
          className="icon !text-purple-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={4} 
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      </button>
      <style jsx>{`
        .styled-button {
          --primary-color: #000;
          --hovered-color: #fff;
          position: relative;
          display: flex;
          font-weight: 600;
          font-size: 15px;
          gap: 0.5rem;
          align-items: center;
          padding: 0;
          margin: 0;
          border: none;
          background: none;
          cursor: pointer;
        }

        .styled-button p {
          margin: 0;
          position: relative;
          font-size: 15px;
          color: var(--primary-color);
        }

        .styled-button::after {
          position: absolute;
          content: "";
          width: 0;
          left: 0;
          bottom: -7px;
          background: var(--hovered-color);
          height: 2px;
          transition: 0.3s ease-out;
        }

        .styled-button p::before {
          position: absolute;
          content: "Subscribe";
          width: 0%;
          inset: 0;
          color: var(--hovered-color);
          overflow: hidden;
          transition: 0.3s ease-out;
        }

        .styled-button:hover::after {
          width: 100%;
        }

        .styled-button:hover p::before {
          width: 100%;
        }

        .styled-button:hover .icon {
          transform: translateX(4px);
          color: #000;
        }

        .icon {
          color: var(--primary-color);
          transition: 0.2s;
          position: relative;
          width: 15px;
          transition-delay: 0.2s;
        }
      `}</style>
    </div>
  );
};

const wrapperStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100%',
};

export default Button;
