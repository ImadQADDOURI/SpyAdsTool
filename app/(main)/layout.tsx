import { FooterSection } from "@/components/adLibrary/landingPage/FooterSection";
import { Navbar } from "@/components/adLibrary/navbar/navbar";
import { NavbarVisibilityProvider } from "@/components/adLibrary/navbar/navbar-visibility-context";

interface MarketingLayoutProps {
  children: React.ReactNode;
}

export default function MarketingLayout({ children }: MarketingLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <NavbarVisibilityProvider>
        <Navbar />
        <main className="flex-1 pt-16">{children}</main>
        <FooterSection />
      </NavbarVisibilityProvider>
    </div>
  );
}
