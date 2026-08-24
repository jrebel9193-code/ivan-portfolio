import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Иван Чернявский — фотограф и видеограф",
  description: "Фотография и видео с характером: музыкальные группы, имидж и каталог, портреты и предметная съёмка. Владимир и выездные проекты.",
  openGraph: {
    title: "Иван Чернявский — фотограф и видеограф",
    description: "Фотография и видео с характером: музыка, имидж, каталог, портрет и предметная съёмка.",
    type: "website",
    locale: "ru_RU",
  },
  twitter: {
    card: "summary_large_image",
    title: "Иван Чернявский — фотограф и видеограф",
    description: "Фотография и видео с характером · Владимир и выезд",
  },
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ru"><body>{children}</body></html>;
}
