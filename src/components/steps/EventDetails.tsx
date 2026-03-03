import { motion } from "framer-motion";
import Image from "next/image";
import { Calendar, MapPin, Clock, CheckCircle } from "lucide-react";

export default function EventDetails({ onNext }: { onNext: () => void }) {
    const highlights = [
        "Keynote Address by Mrs Olubunmi Kuku (MD FAAN)",
        "Chief Host: Capt. Bunmi Gindeh (President, NAAPE)",
        "Sessions on Personal Development & Emotional Intelligence",
        "Networking with Aviation Professionals",
    ];

    return (
        <div className="w-full flex flex-col md:flex-row gap-8 bg-white/40 backdrop-blur-xl p-6 md:p-8 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-brand-primary/10">

            {/* Flyer Image Container */}
            <motion.div
                className="w-full md:w-1/2 rounded-[1.5rem] overflow-hidden relative shadow-lg group aspect-[4/5] md:aspect-auto h-[400px] md:h-auto"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
            >
                <Image
                    src="/event_flyer.jpeg"
                    alt="Event Flyer"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 50vw"
                />

                {/* Floating Badge */}
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-md backdrop-filter backdrop-saturate-150">
                    <span className="text-sm font-bold tracking-widest uppercase text-brand-primary">
                        Give to Gain
                    </span>
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
        </div>
    );
}
