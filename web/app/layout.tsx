import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bible Journey",
  description: "Read the Bible. Understand the Bible. Remember the Bible.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
