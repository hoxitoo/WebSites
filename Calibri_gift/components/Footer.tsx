import { asset } from "@/lib/asset";

export default function Footer() {
  return (
    <footer className="border-t border-cream/10 py-14">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 text-center md:grid-cols-3 md:px-12 md:text-left">
        <div>
          {/* фирменный логотип — на светлой плашке (в оригинале тёмный градиент) */}
          <div className="inline-flex items-center justify-center rounded-2xl bg-cream px-5 py-3">
            <img
              src={asset("/logo-kolibri.webp")}
              alt="Торговая компания «Колибри»"
              className="h-14 w-auto"
              loading="lazy"
              draggable={false}
            />
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
          <p className="mt-2 text-xs text-muted/70">
            Краснодар, ул. Сормовская, 1/2 · доставка по всей России
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-2 md:justify-start">
            {[
              { label: "WhatsApp", href: "https://api.whatsapp.com/send/?phone=79882461551" },
              { label: "Telegram", href: "https://telegram.me/+f0vDIlkA2yY3ODIy" },
              { label: "ВКонтакте", href: "https://vk.com/club215516443" },
            ].map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-cream/15 px-4 py-1.5 text-xs text-cream/80 transition-colors hover:border-gold/50 hover:text-gold"
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>

        <div className="flex flex-col justify-between text-sm md:items-end">
          <a
            href="#lead"
            className="mx-auto inline-block rounded-full border border-gold/40 px-6 py-2.5 text-gold transition-colors duration-200 hover:bg-gold/10 md:mx-0"
          >
            Получить каталог
          </a>
          <p className="mt-6 text-xs leading-relaxed text-muted/60">
            © {new Date().getFullYear()} ООО ТК «Колибри»
            <br />
            ИНН 2312230564 · ОГРН 1152312007473
          </p>
        </div>
      </div>
    </footer>
  );
}
