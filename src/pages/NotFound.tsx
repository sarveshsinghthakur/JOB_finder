import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md rounded-[2rem] border border-border/80 bg-card/92 p-8 text-center shadow-[0_16px_34px_hsl(var(--foreground)/0.08)]">
        <h1 className="mb-2 text-4xl font-bold tracking-tight">404</h1>
        <p className="mb-5 text-lg text-muted-foreground">Page not found</p>
        <a
          href="/"
          className="inline-flex rounded-[1rem] border border-border/80 px-4 py-2 text-sm font-semibold hover:bg-accent"
        >
          Return home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
