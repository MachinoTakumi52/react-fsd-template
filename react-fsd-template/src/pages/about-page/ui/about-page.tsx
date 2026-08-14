import { Link } from "react-router-dom";

export const AboutPage = () => {
  return (
    <main className="about-page">
      <section className="about-page__hero">
        <h1>About Page</h1>
        <p>This page is used to verify the router is working.</p>
        <Link to="/">Back to Home</Link>
      </section>
    </main>
  );
};
