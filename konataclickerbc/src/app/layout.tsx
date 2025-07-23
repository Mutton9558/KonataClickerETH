export const metadata = {
  title: "Konata Clicker",
  description: "Cookie Clicker but instead of Cookie it's Konata",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
