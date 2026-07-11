export default function Footer() {
  return (
    <footer className="border-t border-cream/10 py-14">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 text-center md:grid-cols-3 md:px-12 md:text-left">
        <div>
          <div className="flex items-baseline justify-center gap-3 md:justify-start">
            <span className="font-display text-xl tracking-wide text-cream">
              КОЛИБРИ
            </span>
            <span className="text-xs uppercase tracking-[0.25em] text-muted">
              торговая компания
            </span>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            Корпоративные новогодние подарки
            <br />
            11 лет на рынке · 1000+ компаний
          </p>
          <a
            href="/merch"
            className="mt-2 inline-block text-xs text-muted/60 underline-offset-4 transition-colors hover:text-gold"
          >
            Мерч и подарки к проф.праздникам — скоро
          </a>
        </div>

        <div className="text-sm">
          <p className="mb-3 text-xs uppercase tracking-[0.25em] text-gold/70">
            Связаться с нами
          </p>
          <p className="flex flex-col gap-1.5">
            <a href="tel:+78612506551" className="text-cream/90 transition-colors hover:text-gold">
              8 (861) 250-65-51
            </a>
            <a href="tel:+79882461551" className="text-cream/90 transition-colors hover:text-gold">
              8 (988) 246-15-51
            </a>
            <a
              href="mailto:info@kolibri-ug.ru"
              className="text-cream/90 transition-colors hover:text-gold"
            >
              info@kolibri-ug.ru
            </a>
          </p>
          <p className="mt-2 text-xs text-muted/70">Краснодар · доставка по всей России</p>
        </div>

        <div className="flex flex-col justify-between text-sm md:items-end">
          <a
            href="#lead"
            className="mx-auto inline-block rounded-full border border-gold/40 px-6 py-2.5 text-gold transition-colors duration-200 hover:bg-gold/10 md:mx-0"
          >
            Получить каталог
          </a>
          <p className="mt-6 text-xs text-muted/60">
            © {new Date().getFullYear()} ТК «Колибри»
          </p>
        </div>
      </div>
    </footer>
  );
}
