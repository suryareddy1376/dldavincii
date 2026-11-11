import { FloatingNav } from "@/components/FloatingNav";
import { StudioClientShell } from "@/components/StudioClientShell";
import { Footer } from "@/components/Footer";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#000000]">
      <FloatingNav />
      <StudioClientShell />
      <Footer />
    </div>
  );
}
