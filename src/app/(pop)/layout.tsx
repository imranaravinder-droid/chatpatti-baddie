import "../globals.css";

export const metadata = {
  title: "Chatpattie Baddie — Free AI in 24 Languages",
  description: "22+ AI specialists — Study, Space, Music, Life Coach, CB Lens. Free, private, speaks 24 Indian languages.",
  robots: "index, follow",
};

export default function PopLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="bg-black text-white min-h-screen m-0 p-0">
        {children}
      </body>
    </html>
  );
}
