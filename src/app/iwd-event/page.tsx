import RegistrationWizard from "@/components/RegistrationWizard";
import Image from "next/image";

export default function IWDEventPage() {
    const isMaintenance = true; // TOGGLE THIS TO FALSE TO SEE THE FORM WHILE FIXING

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
            <div className="relative z-10 flex-grow flex flex-col items-center justify-start px-4 md:px-8 pb-32 mb-16 w-full max-w-7xl mx-auto">
                {isMaintenance ? (
                    <div className="bg-white/90 backdrop-blur-md shadow-2xl rounded-2xl p-8 md:p-12 text-center max-w-2xl w-full border border-brand-primary/20 mt-8">
                        <div className="inline-flex items-center justify-center p-4 bg-brand-primary/10 rounded-full mb-6">
                            <svg className="w-12 h-12 text-brand-primary animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
                            </svg>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
                            We're Upgrading!
                        </h1>
                        <p className="text-lg md:text-xl text-gray-700 mb-8 leading-relaxed">
                            Registration is temporarily on hold while we perform some quick maintenance to improve your experience. 
                            Please check back soon!
                        </p>
                    </div>
                ) : (
                    <RegistrationWizard />
                )}
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
