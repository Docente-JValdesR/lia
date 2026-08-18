import { Nunito, Geist_Mono } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { VozProvider } from "@/components/voz/VozProvider";
import { NIVELES } from "@/data/curriculum";
import { SITE } from "@/data/site";
import "./globals.css";

const nunito = Nunito({ variable: "--font-nunito", subsets: ["latin"], display: "swap" });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"], display: "swap" });

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8f9fc" },
    { media: "(prefers-color-scheme: dark)", color: "#12131a" },
  ],
};

export const metadata = {
  metadataBase: new URL(SITE.url),
  applicationName: SITE.nombre,
  title: {
    default: `${SITE.nombre} · ${SITE.tagline} | ${SITE.eslogan}`,
    template: `%s | ${SITE.nombre}`,
  },
  description: SITE.descripcion,
  category: "education",
  keywords: [
    "L+IA",
    "comprensión lectora",
    "velocidad lectora",
    "palabras por minuto",
    "Currículum Nacional",
    "MINEDUC",
    "SIMCE lectura",
    "objetivos de aprendizaje",
    "recursos para docentes",
    "practicar lectura en casa",
    "lectura con inteligencia artificial",
    "educación Chile",
  ],
  authors: [{ name: SITE.autor }],
  creator: SITE.autor,
  publisher: SITE.nombre,
  alternates: { canonical: "/" },
  formatDetection: { telephone: false, address: false, email: false },
  openGraph: {
    type: "website",
    locale: "es_CL",
    url: SITE.url,
    siteName: SITE.nombre,
    title: `${SITE.nombreLargo} · ${SITE.eslogan}`,
    description: SITE.descripcion,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.nombreLargo} · ${SITE.eslogan}`,
    description: SITE.descripcion,
  },
  appleWebApp: { capable: true, title: SITE.nombre, statusBarStyle: "default" },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
};

const datosEstructurados = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${SITE.url}/#website`,
      url: SITE.url,
      name: SITE.nombre,
      alternateName: SITE.nombreLargo,
      description: SITE.descripcion,
      inLanguage: "es-CL",
      publisher: { "@id": `${SITE.url}/#autor` },
    },
    {
      "@type": "Person",
      "@id": `${SITE.url}/#autor`,
      name: SITE.autor,
      email: SITE.email,
      url: SITE.linkedin,
    },
    {
      "@type": "WebApplication",
      "@id": `${SITE.url}/#app`,
      name: SITE.nombre,
      alternateName: SITE.nombreLargo,
      url: `${SITE.url}/app`,
      applicationCategory: "EducationalApplication",
      operatingSystem: "Web",
      browserRequirements: "Requiere JavaScript",
      inLanguage: "es-CL",
      description: SITE.descripcion,
      slogan: SITE.eslogan,
      isAccessibleForFree: true,
      offers: { "@type": "Offer", price: "0", priceCurrency: "CLP" },
      author: { "@id": `${SITE.url}/#autor` },
      educationalUse: ["practice", "assessment"],
      learningResourceType: "Actividad de comprensión lectora",
      teaches: "Comprensión lectora",
      educationalLevel: NIVELES.map((n) => n.label),
      audience: {
        "@type": "EducationalAudience",
        educationalRole: ["student", "teacher", "parent"],
      },
      countriesSupported: "CL",
    },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="es-CL" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('lia.tema');if(!t){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}if(t==='dark'){document.documentElement.classList.add('dark');}}catch(e){}})();`,
          }}
        />
      </head>
      <body
        className={`${nunito.variable} ${geistMono.variable} flex min-h-screen flex-col antialiased`}
      >
        <a
          href="#contenido"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-brand focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
        >
          Saltar al contenido
        </a>
        <VozProvider>
          <Navbar />
          <main id="contenido" className="flex-1">
            {children}
          </main>
          <Footer />
        </VozProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(datosEstructurados) }}
        />
      </body>
    </html>
  );
}
