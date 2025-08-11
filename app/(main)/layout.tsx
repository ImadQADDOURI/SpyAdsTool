import { FooterSection } from "@/components/adTool/landingPage/FooterSection";
import { Navbar } from "@/components/adTool/navbar/navbar";
import { NavbarVisibilityProvider } from "@/components/adTool/navbar/navbar-visibility-context";

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
