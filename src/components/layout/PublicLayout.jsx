import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import PublicNavbar from "../public/PublicNavbar";

export default function PublicLayout() {
  const location = useLocation();
  const isHome = location.pathname === "/";

  useEffect(() => {
    if (
      typeof window === "undefined" ||
      typeof IntersectionObserver === "undefined" ||
      typeof MutationObserver === "undefined"
    ) {
      return undefined;
    }

    const intersection = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("visible");
          intersection.unobserve(entry.target);
        });
      },
      { threshold: 0.18, rootMargin: "0px 0px -8% 0px" },
    );

    const observeTargets = () => {
      const targets = document.querySelectorAll(".reveal-on-scroll:not(.visible)");
      targets.forEach((target) => intersection.observe(target));
    };

    observeTargets();
    const mutation = new MutationObserver(observeTargets);
    mutation.observe(document.body, { childList: true, subtree: true });

    return () => {
      mutation.disconnect();
      intersection.disconnect();
    };
  }, [location.pathname]);

  return (
    <div className="public-shell">
      {isHome ? (
        <PublicNavbar />
      ) : (
        <header className="detail-navbar">
          <div className="site-container detail-navbar-inner">
            <a href="/" className="brand-link">
              <strong>Proskuneo Church</strong>
              <span>Back to Home</span>
            </a>
          </div>
        </header>
      )}
      <Outlet />
    </div>
  );
}
