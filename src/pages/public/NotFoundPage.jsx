import SeoHead from "../../components/common/SeoHead";

export default function NotFoundPage() {
  return (
    <div className="not-found">
      <SeoHead
        title="Halaman Tidak Ditemukan | Proskuneo Church"
        description="Halaman yang Anda cari tidak tersedia di situs Proskuneo Church."
        path="/404"
        robots="noindex,nofollow"
        image="/images/hero.jpg"
      />
      <h1>404</h1>
      <p>Halaman yang Anda cari tidak tersedia.</p>
      <a href="/" className="button-primary">
        Back to Home
      </a>
    </div>
  );
}
