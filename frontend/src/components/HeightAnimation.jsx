import { useRef, useEffect, useState } from "react";
import { useSpring, animated } from "@react-spring/web";

export const HeightAnimation = ({ children }) => {
  const contentRef = useRef();
  const [styles, api] = useSpring(() => ({
    height: 0,
    config: { duration: 150 },
  }));

  useEffect(() => {
    if (contentRef.current) {
      api.start({ height: contentRef.current.clientHeight });
    }
  }, [children]);

  return (
    <animated.div style={{ ...styles, overflow: "hidden" }}>
      <div ref={contentRef}>{children}</div>
    </animated.div>
  );
};
