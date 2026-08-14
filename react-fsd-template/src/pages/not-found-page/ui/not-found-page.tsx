import { Link } from "react-router-dom";

export const NotFoundPage = () => {
  return (
    <main className="not-found-page">
      <section className="not-found-page__hero">
        <h1>404 - Page Not Found</h1>
        <p>The page you requested could not be found.</p>
        <Link to="/">Back to Home</Link>
      </section>
    </main>
  );
};
