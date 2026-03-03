import RegistrationWizard from "@/components/RegistrationWizard";
import Image from "next/image";

export default function IWDEventPage() {
    return (
        <main className="flex-grow flex flex-col min-h-screen relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-primary/20 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-accent/20 blur-[120px] rounded-full pointer-events-none" />

            {/* Header */}
            <header className="relative z-10 w-full px-6 py-8 md:py-10 flex flex-col items-center justify-center">
                <div className="flex items-center justify-center relative w-[240px] h-[85px] sm:w-[300px] sm:h-[100px] md:w-[360px] md:h-[120px] transition-all duration-500 hover:scale-105 hover:drop-shadow-xl">
                    <Image
                        src="/logo_noBG.png"
                        alt="Event Logo"
                        fill
                        sizes="(max-width: 640px) 240px, (max-width: 768px) 300px, 360px"
                        className="object-contain drop-shadow-md"
                        priority
                    />
                </div>
            </header>

            {/* Main Content */}
            <div className="relative z-10 flex-grow flex flex-col items-center justify-start px-4 md:px-8 pb-12 w-full max-w-7xl mx-auto">
                <RegistrationWizard />
            </div>

            {/* Footer */}
            <footer className="relative z-10 py-6 text-center text-brand-dark/60 text-sm">
                <p>&copy; {new Date().getFullYear()} The Events Team. All rights reserved.</p>
                <div className="flex justify-center gap-4 mt-2">
                    <a href="#" className="hover:text-brand-primary transition-colors">Contact Us</a>
                    <a href="#" className="hover:text-brand-primary transition-colors">Privacy Policy</a>
                </div>
            </footer>
        </main>
    );
}
