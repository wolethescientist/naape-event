import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Calendar, MapPin, Clock, CheckCircle, ChevronLeft, ChevronRight, Download, X, Maximize2 } from "lucide-react";

export default function EventDetails({ onNext }: { onNext: () => void }) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMounted(true);
    }, []);

    const highlights = [
        "Keynote Address by Mrs Olubunmi Kuku (MD FAAN)",
        "Chief Host: Capt. Bunmi Gindeh (President, NAAPE)",
        "Sessions on Personal Development & Emotional Intelligence",
        "Networking with Aviation Professionals",
    ];

    const flyers = [
        "/event_flyer2.jpeg",
        "/event_flyer3.jpeg"
    ];

    const [currentFlyer, setCurrentFlyer] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        if (isModalOpen) return;
        const timer = setInterval(() => {
            setCurrentFlyer((prev) => (prev + 1) % flyers.length);
        }, 5000); // 5 seconds per slide
        return () => clearInterval(timer);
    }, [flyers.length, isModalOpen]);

    const handleNext = () => setCurrentFlyer((prev) => (prev + 1) % flyers.length);
    const handlePrev = () => setCurrentFlyer((prev) => (prev - 1 + flyers.length) % flyers.length);

    const handleDownload = () => {
        const link = document.createElement("a");
        link.href = flyers[currentFlyer];
        link.download = flyers[currentFlyer].split("/").pop() || "flyer.jpeg";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="w-full flex flex-col md:flex-row gap-8 bg-white/40 backdrop-blur-xl p-6 md:p-8 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-brand-primary/10">

            {/* Flyer Image Container */}
            <motion.div
                className="w-full md:w-1/2 rounded-[1.5rem] overflow-hidden relative shadow-lg group min-h-[450px] md:min-h-[600px] bg-white/30"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
            >
                <AnimatePresence>
                    <motion.div
                        key={currentFlyer}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1, ease: "easeInOut" }}
                        className="absolute inset-0 w-full h-full cursor-pointer"
                        onClick={() => setIsModalOpen(true)}
                    >
                        <Image
                            src={flyers[currentFlyer]}
                            alt={`Event Flyer ${currentFlyer + 1}`}
                            fill
                            className="object-contain transition-transform duration-700 group-hover:scale-[1.02]"
                            sizes="(max-width: 768px) 100vw, 50vw"
                            priority={currentFlyer === 0}
                        />
                    </motion.div>
                </AnimatePresence>

                {/* Navigation and Actions Overlay */}
                <div className="absolute inset-0 flex flex-col justify-between p-4 z-10 pointer-events-none">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="bg-white/90 backdrop-blur-md p-2 rounded-full shadow-md text-brand-primary hover:bg-brand-primary hover:text-white transition-colors pointer-events-auto"
                            title="Enlarge Flyer"
                        >
                            <Maximize2 size={20} />
                        </button>
                        <button
                            onClick={handleDownload}
                            className="bg-white/90 backdrop-blur-md p-2 rounded-full shadow-md text-brand-primary hover:bg-brand-primary hover:text-white transition-colors pointer-events-auto"
                            title="Download Flyer"
                        >
                            <Download size={20} />
                        </button>
                    </div>

                    <div className="flex justify-between items-center mb-auto mt-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button
                            onClick={handlePrev}
                            className="bg-white/90 backdrop-blur-md p-2 rounded-full shadow-md text-brand-primary hover:bg-brand-primary hover:text-white transition-colors pointer-events-auto bg-opacity-70"
                            aria-label="Previous Slide"
                        >
                            <ChevronLeft size={24} />
                        </button>
                        <button
                            onClick={handleNext}
                            className="bg-white/90 backdrop-blur-md p-2 rounded-full shadow-md text-brand-primary hover:bg-brand-primary hover:text-white transition-colors pointer-events-auto bg-opacity-70"
                            aria-label="Next Slide"
                        >
                            <ChevronRight size={24} />
                        </button>
                    </div>

                    <div className="flex justify-center gap-2 mt-auto pb-2 pointer-events-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        {flyers.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentFlyer(idx)}
                                className={`w-2.5 h-2.5 rounded-full transition-all ${currentFlyer === idx ? "bg-brand-primary scale-125 w-5 shadow-sm" : "bg-black/30 hover:bg-black/50"
                                    }`}
                                aria-label={`Go to slide ${idx + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </motion.div>

            {/* Info Container */}
            <motion.div
                className="w-full md:w-1/2 flex flex-col justify-center space-y-6"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
            >
                <div>
                    <h1 className="text-3xl md:text-5xl font-extrabold text-brand-dark leading-tight mt-2 mb-4 drop-shadow-sm">
                        2026 International Women&apos;s Day
                    </h1>
                    <p className="text-brand-dark/70 text-lg leading-relaxed">
                        Join the brightest minds in aviation and aerospace for a day of insightful keynotes, groundbreaking sessions, and unparalleled networking opportunities.
                    </p>
                </div>

                <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3 text-brand-dark w-fit bg-brand-light/50 px-4 py-3 rounded-xl border border-brand-primary/10">
                        <Calendar className="text-brand-primary" size={24} />
                        <span className="font-semibold tracking-wide">March 07, 2026</span>
                    </div>
                    <div className="flex items-center gap-3 text-brand-dark w-fit bg-brand-light/50 px-4 py-3 rounded-xl border border-brand-primary/10">
                        <Clock className="text-brand-primary" size={24} />
                        <span className="font-semibold tracking-wide">10:00 AM Prompt</span>
                    </div>
                    <div className="flex items-center gap-3 text-brand-dark w-fit bg-brand-light/50 px-4 py-3 rounded-xl border border-brand-primary/10">
                        <MapPin className="text-brand-primary flex-shrink-0" size={24} />
                        <span className="font-semibold tracking-wide">NCAA Conference Hall, NCAA Regional Office, Along MMIA Ikeja, Lagos</span>
                    </div>
                </div>

                {/* Highlights */}
                <ul className="space-y-3 pt-2">
                    {highlights.map((h, i) => (
                        <motion.li
                            key={i}
                            className="flex items-center gap-3 text-brand-dark/80 font-medium"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 + (i * 0.1) }}
                        >
                            <CheckCircle size={20} className="text-brand-accent flex-shrink-0" />
                            <span>{h}</span>
                        </motion.li>
                    ))}
                </ul>

                {/* CTA Button */}
                <motion.button
                    onClick={onNext}
                    className="mt-6 w-full py-4 bg-brand-primary text-white text-lg font-bold tracking-widest uppercase rounded-2xl shadow-lg shadow-brand-primary/30 hover:-translate-y-1 hover:shadow-xl hover:shadow-brand-primary/40 transition-all duration-300"
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                >
                    Register Now
                </motion.button>
            </motion.div>

            {/* Fullscreen Image Modal - Rendered in Portal */}
            {mounted && typeof document !== "undefined" ? createPortal(
                <AnimatePresence>
                    {isModalOpen && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 md:p-8"
                            onClick={() => setIsModalOpen(false)}
                        >
                            <div className="absolute top-4 right-4 md:top-8 md:right-8 flex gap-4 z-[10000]">
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleDownload(); }}
                                    className="bg-brand-primary hover:bg-brand-dark text-white p-3 rounded-full shadow-[0_0_20px_rgba(0,0,0,0.5)] transition-colors"
                                    title="Download Flyer"
                                >
                                    <Download size={28} />
                                </button>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="bg-white/20 hover:bg-white/30 text-white p-3 rounded-full shadow-[0_0_20px_rgba(0,0,0,0.5)] transition-colors"
                                    title="Close"
                                >
                                    <X size={28} />
                                </button>
                            </div>

                            <div className="flex justify-between items-center absolute inset-y-0 left-4 right-4 pointer-events-none z-[10000]">
                                <button
                                    onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                                    className="bg-black/50 hover:bg-black/70 backdrop-blur-md p-3 rounded-full text-white transition-colors pointer-events-auto shadow-lg"
                                >
                                    <ChevronLeft size={32} />
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleNext(); }}
                                    className="bg-black/50 hover:bg-black/70 backdrop-blur-md p-3 rounded-full text-white transition-colors pointer-events-auto shadow-lg"
                                >
                                    <ChevronRight size={32} />
                                </button>
                            </div>

                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                                className="relative w-full h-full max-w-5xl max-h-[90vh]"
                                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking the image itself
                            >
                                <Image
                                    src={flyers[currentFlyer]}
                                    alt={`Event Flyer ${currentFlyer + 1} Enlarged`}
                                    fill
                                    className="object-contain"
                                    sizes="100vw"
                                />
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>,
                document.body
            ) : null}
        </div>
    );
}

