import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll after route change and render
    const timeout = setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 0);

    // Clean up timeout
    return () => clearTimeout(timeout);
  }, [pathname]);

  return null;
};

export default ScrollToTop;
