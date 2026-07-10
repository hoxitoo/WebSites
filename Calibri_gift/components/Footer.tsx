export default function Footer() {
  return (
    <footer className="border-t border-cream/10 py-12">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-6 md:flex-row md:px-12">
        <div className="flex items-baseline gap-3">
          <span className="font-display text-xl tracking-wide text-cream">
            КОЛИБРИ
          </span>
          <span className="text-xs uppercase tracking-[0.25em] text-muted">
            торговая компания
          </span>
        </div>
        <p className="text-center text-sm text-muted">
          Корпоративные новогодние подарки · 11 лет на рынке · 1000+ компаний
        </p>
        <p className="text-xs text-muted/60">
          © {new Date().getFullYear()} ТК «Колибри»
        </p>
      </div>
    </footer>
  );
}
