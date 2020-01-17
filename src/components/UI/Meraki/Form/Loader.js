import React, { useState, useEffect } from "react";

const UIMerakiFormLoader = ({ retries }) => {
  const [number, setNumber] = useState(10);

  useEffect(() => {
    let timer;
    const loopTimer = async _ => {
      await new Promise(resolve => setTimeout(resolve, 750));
      console.log("ticking");
      for (let x = 0; x < 10; x++) {
        timer = await new Promise(resolve =>
          setTimeout(() => {
            resolve(setNumber(x => x - 1));
          }, 1000)
        );
      }
    };
    if (retries > 0 && retries !== 4) {
      setNumber(10);
      if (timer) clearTimeout(timer);
      else {
        loopTimer();
      }
    }
  }, [retries]);
  return (
    <svg
      style={{
        margin: "auto",
        background: "none",
        display: "block",
        shapeRendering: "auto"
      }}
      width="150px"
      height="150px"
      viewBox="10 10 80 80"
      preserveAspectRatio="xMidYMid"
    >
      <path
        d="M82 50A32 32 0 1 1 23.533421623214014 32.01333190873183 L21.71572875253809 21.7157287525381 L32.013331908731814 23.53342162321403 A32 32 0 0 1 82 50"
        strokeWidth="5"
        stroke="#1d3f72"
        fill="none"
      ></path>
      <circle
        cx="50"
        cy="50"
        r="20.8"
        strokeWidth="5"
        stroke="#1d3f72"
        strokeDasharray="32.67256359733385 32.67256359733385"
        fill="none"
        strokeLinecap="round"
        transform="rotate(27.7376 50 50)"
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          repeatCount="indefinite"
          dur="2.6315789473684212s"
          keyTimes="0;1"
          values="0 50 50;360 50 50"
        ></animateTransform>
      </circle>
      <text
        x={number === 10 || number === 11 ? 40 : 45}
        y="55"
        textAnchor="center"
        stroke="#1d3f72"
        strokeWidth="1.75"
        fill="#1d3f72"
        fontSize="17px"
      >
        {number}
      </text>
    </svg>
  );
};

export default UIMerakiFormLoader;
