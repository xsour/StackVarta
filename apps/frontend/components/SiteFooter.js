import { siteConfig } from '../lib/site-config';

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <p>{siteConfig.name} © 2026</p>
      </div>
    </footer>
  );
}
