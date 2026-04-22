import Image from "next/image";
import Link from "next/link";
import { Logo } from "@/components/layout/Logo";
import LanguageSwitcher from "@/components/layout/LanguageSwitcherClient";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white">
      <div className="grid min-h-screen lg:grid-cols-2">
        <div className="hidden lg:block relative">
          <Image src="/stock-images/1 (2).jpg" alt="Care team" fill loading="eager" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-white px-8">
              <Link href="/" className="inline-flex">
                <Logo variant="full" size={500} className="mb-4" />
              </Link>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center p-6">
          <div className="w-full max-w-[var(--layout-auth-panel-width)] space-y-6">
            <div className="flex items-center justify-between">
              <Link href="/" className="flex items-center">
                <span className="lg:hidden inline-flex">
                  <Logo variant="icon" size="md" />
                </span>
                <span className="hidden lg:inline-flex">
                  <Logo variant="landscape" size="md" />
                </span>
              </Link>
              <div className="hidden sm:block">
                {/* Public auth pages show language switcher */}
                <LanguageSwitcher />
              </div>
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
