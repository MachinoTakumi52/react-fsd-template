import { Link } from "react-router-dom";
import { Button } from "@shared/ui";

export const HomePage = () => {
  return (
    <main className="home-page">
      <section className="home-page__hero">
        <h1>Welcome to FSD Template</h1>
        <p className="home-page__description">This page demonstrates a layered React structure.</p>
        <Link to="/about">
          <Button>Open About</Button>
        </Link>
      </section>
    </main>
  );
};
