import type { Metadata } from "next";
import "./globals.css";
import ThemeSwitcher from "@/components/client/ThemeSwitcher";
import { getMessages } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import LanguageSwitch from "@/components/client/LanguageSwitch";

export const metadata: Metadata = {
  title: "Kiddyland",
  description: "INGKA Centres Kiddyland",
};

export default async function RootLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  // if (!routing.locales.includes(locale as TLocales)) {
  //   notFound();
  // }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <header>

          </header>
          <main>
            <ThemeSwitcher />
            <LanguageSwitch />
            {children}

          </main>
          <footer></footer>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
