export default function NotFound() {
  return (
    <main className="content" style={{ maxWidth: 560, textAlign: "center", paddingTop: 96 }}>
      <div className="eyebrow">404</div>
      <h1>Page not found</h1>
      <p className="sub">We couldn’t find the page you were looking for.</p>
      {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
      <a className="btn" href="/">
        Return to LifeCome Health
      </a>
    </main>
  );
}
