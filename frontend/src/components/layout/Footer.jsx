export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="footer-content">
        <p>Veyncore Full-Stack Architecture &copy; {currentYear}. All rights reserved.</p>
        <p>Next.js App Router &bull; Express MVC &bull; MongoDB Atlas</p>
      </div>
    </footer>
  );
}
