import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AuthProvider from "../components/AuthContext";

export const metadata = {
  title: "Aether | E‑commerce",
  description: "Next.js + Express + MongoDB demo store"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Navbar />
          <main className="py-10">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
