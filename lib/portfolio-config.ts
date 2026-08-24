export type CategoryId = "music" | "brand" | "portrait" | "product";
export type ImageShape = "tall" | "wide" | "square";

export type PortfolioItem = {
  id: string;
  category: CategoryId;
  src: string;
  storageKey: string | null;
  alt: string;
  shape: ImageShape;
  sortOrder: number;
  createdAt: string;
};

export type ContactSettings = {
  telegram: string;
  vk: string;
  phone: string;
};

export type SiteContent = {
  hero: { eyebrow: string; titleLine1: string; titleLine2: string; description: string };
  approach: string;
  portfolioIntro: string;
  categories: Array<{ id: CategoryId; index: string; title: string; note: string; description: string }>;
  services: Array<{ number: string; title: string; text: string }>;
  about: { nameLine1: string; nameLine2: string; lead: string; body: string };
  process: Array<{ number: string; title: string; text: string }>;
  contact: { titleLine1: string; titleLine2: string; note: string };
};

export const defaultContacts: ContactSettings = {
  telegram: "https://t.me/camerashutter",
  vk: "https://vk.ru/j_rebel",
  phone: "+79206209193",
};

export const defaultContent: SiteContent = {
  hero: {
    eyebrow: "Иван Чернявский · Владимир / выезд",
    titleLine1: "Фото",
    titleLine2: "/ Видео",
    description: "Коммерческая точность, живой человек и свет, который не притворяется.",
  },
  approach: "Снимаю не ради красивой картинки. Кадр должен продавать продукт, собирать образ или оставаться в памяти.",
  portfolioIntro: "Не лента из всего подряд, а четыре собранных направления. Каждая серия отвечает на свою задачу и остаётся частью одного визуального языка.",
  categories: [
    { id: "music", index: "01", title: "Музыка", note: "Промо · live · обложки", description: "Сценическая энергия, характер артиста и кадры, которые звучат даже без дорожки." },
    { id: "brand", index: "02", title: "Имидж / каталог", note: "Brand · campaign · lookbook", description: "Коммерческая съёмка без стерильности: продукт читается, бренд запоминается." },
    { id: "portrait", index: "03", title: "Люди", note: "Portrait · editorial · emotion", description: "Портреты без дежурной уверенности: через жест, среду, свет и настоящую эмоцию." },
    { id: "product", index: "04", title: "Предметы", note: "Product · detail · e-commerce", description: "Фактура, форма и детали продукта — точно, выразительно и готово к коммерческому использованию." },
  ],
  services: [
    { number: "01", title: "Каталог", text: "Marketplace, lookbook, предметная и модельная съёмка" },
    { number: "02", title: "Имидж", text: "Кампейны и контент для брендов" },
    { number: "03", title: "Музыка", text: "Промо, концерты, обложки и музыкальное видео" },
    { number: "04", title: "Портрет", text: "Бизнес-портрет и эмоциональные персональные серии" },
  ],
  about: {
    nameLine1: "Иван",
    nameLine2: "Чернявский",
    lead: "Фотограф и видеограф с опытом более десяти лет. Работаю на стыке коммерческой точности и живого человеческого кадра.",
    body: "Понимаю задачи бренда, умею держать темп площадки и не теряю человека за техническим заданием. Снимаю во Владимире и выезжаю на проекты.",
  },
  process: [
    { number: "01", title: "Задача", text: "Определяем, что должен сделать кадр: продать, представить или запомниться." },
    { number: "02", title: "Съёмка", text: "Собираю свет, ритм и атмосферу — без лишнего производственного цирка." },
    { number: "03", title: "Результат", text: "Отдаю собранную серию или видео, готовые к публикации и работе." },
  ],
  contact: {
    titleLine1: "Есть задача?",
    titleLine2: "Давайте снимать.",
    note: "Расскажите о задаче — отвечу, уточню детали и предложу формат съёмки.",
  },
};

const seeds: Array<[CategoryId, string, string, ImageShape]> = [
  ["brand", "brand-n1", "Имиджевая съёмка бренда", "wide"],
  ["brand", "brand-t2", "Каталожная съёмка одежды", "tall"],
  ["brand", "brand-0911", "Зимняя имиджевая съёмка", "tall"],
  ["portrait", "portrait-0239", "Эмоциональный портрет", "tall"],
  ["product", "product-shirt", "Предметная съёмка футболки", "square"],
  ["music", "music-4632", "Промопортрет музыкальной группы", "wide"],
  ["portrait", "portrait-3bw", "Чёрно-белый портрет", "tall"],
  ["music", "music-2183", "Концертная фотография", "tall"],
  ["product", "product-vest", "Каталожная съёмка жилета", "tall"],
  ["portrait", "portrait-4103", "Персональный портрет", "wide"],
  ["brand", "brand-0458", "Имиджевая серия", "wide"],
  ["music", "music-6184", "Музыкальная группа", "wide"],
  ["product", "product-bottle", "Предметная съёмка бутылки", "square"],
  ["portrait", "portrait-9009", "Студийный портрет", "tall"],
  ["brand", "brand-9214", "Каталожная серия", "tall"],
  ["music", "music-6049", "Промо музыкального проекта", "tall"],
  ["music", "music-4666", "Концертный кадр", "wide"],
  ["brand", "brand-0881", "Имиджевая съёмка", "wide"],
  ["portrait", "portrait-1479", "Бизнес-портрет", "tall"],
  ["portrait", "portrait-1166", "Эмоциональный портрет", "wide"],
];

export const defaultPortfolioItems: PortfolioItem[] = seeds.map(([category, name, alt, shape], sortOrder) => ({
  id: `seed-${name}`,
  category,
  src: `/photos/web/${name}.webp`,
  storageKey: null,
  alt,
  shape,
  sortOrder,
  createdAt: "2026-01-01T00:00:00.000Z",
}));
