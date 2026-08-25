import { getSiteData } from "@/lib/db";
import HeroSlider from "./HeroSlider";
export const dynamic = "force-dynamic";

function Arrow() {
  return <span aria-hidden="true">↗</span>;
}

export default async function Home() {
  const { items, contacts, content } = await getSiteData();
  const collections = content.categories.map((collection) => ({
    ...collection,
    images: items.filter((item) => item.category === collection.id),
  }));

  return (
    <main>
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="В начало страницы">
          <span>Иван Чернявский</span><small>photo / video</small>
        </a>
        <nav aria-label="Основная навигация">
          <a href="#work">Работы</a><a href="#services">Съёмки</a><a href="#about">Об авторе</a>
        </nav>
        <a className="header-cta" href="#contact">Обсудить проект <Arrow /></a>
      </header>

<section className="hero" id="top">
  <HeroSlider />
      </section>

      <section className="manifesto" aria-label="Подход к работе">
        <p className="section-index">[ ПОДХОД ]</p><p className="manifesto-text">{content.approach}</p>
      </section>

      <section className="work" id="work">
        <div className="work-intro">
          <p className="section-index">[ ИЗБРАННЫЕ РАБОТЫ / 2024—2026 ]</p><h2>Портфолио</h2><p>{content.portfolioIntro}</p>
        </div>
        {collections.map((collection) => (
          <section className={`collection collection-${collection.id}`} id={collection.id} key={collection.id}>
            <div className="collection-heading"><span>{collection.index}</span><div><h3>{collection.title}</h3><small>{collection.note}</small></div><p>{collection.description}</p></div>
            <div className="gallery">
              {collection.images.map((image, index) => (
                <figure className={`gallery-card ${image.shape}`} key={image.id}>
                  <img src={image.src} alt={image.alt} loading="lazy" decoding="async" />
                  <figcaption><span>{collection.title}</span><b>{String(index + 1).padStart(2, "0")}</b></figcaption>
                </figure>
              ))}
            </div>
          </section>
        ))}
      </section>

      <section className="services" id="services">
        <div className="section-lead"><p className="section-index">[ НАПРАВЛЕНИЯ ]</p><h2>Что снимаю</h2></div>
        <div className="service-list">
          {content.services.map((service) => <article className="service" key={service.number}><span>{service.number}</span><h3>{service.title}</h3><p>{service.text}</p><b aria-hidden="true">↗</b></article>)}
        </div>
      </section>

      <section className="about" id="about">
        <div className="about-title"><p className="section-index">[ ОБ АВТОРЕ ]</p><h2>{content.about.nameLine1}<br />{content.about.nameLine2}</h2></div>
        <div className="about-copy">
          <p className="lead">{content.about.lead}</p><p>{content.about.body}</p>
          <div className="facts" aria-label="Ключевые факты"><div><strong>10+</strong><span>лет за камерой</span></div><div><strong>PHOTO</strong><span>каталог и портрет</span></div><div><strong>VIDEO</strong><span>имидж и музыка</span></div></div>
        </div>
      </section>

      <section className="process">
        <p className="section-index">[ КАК РАБОТАЕМ ]</p>
        <div className="process-grid">{content.process.map((step) => <article key={step.number}><span>{step.number}</span><h3>{step.title}</h3><p>{step.text}</p></article>)}</div>
      </section>

      <section className="contact" id="contact">
        <p className="section-index">[ КОНТАКТ ]</p><h2>{content.contact.titleLine1}<br /><em>{content.contact.titleLine2}</em></h2><p className="contact-note">{content.contact.note}</p>
        <div className="contact-list" aria-label="Способы связи">
          <a href={contacts.telegram} target="_blank" rel="noreferrer">Telegram <Arrow /></a>
          <a href={contacts.vk} target="_blank" rel="noreferrer">VK <Arrow /></a>
          <a href={`tel:${contacts.phone.replace(/[^+\d]/g, "")}`}>{contacts.phone} <Arrow /></a>
        </div>
      </section>

      <footer><p>© {new Date().getFullYear()} Иван Чернявский</p><p>Фотография · Видео · Владимир</p><a href="#top">Наверх ↑</a></footer>
    </main>
  );
}
