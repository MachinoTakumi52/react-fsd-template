import { Button } from "../../../shared/ui";

export function HomePage() {
  return (
    <main className="home-page">
      <section className="home-page__hero">
        <h1>Welcome to FSD Template</h1>
        <p className="home-page__description">This page demonstrates a layered React structure.</p>
        <Button>Open Dashboard</Button>
      </section>
    </main>
  );
}
