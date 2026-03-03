import { motion } from "framer-motion";
import { CheckCircle, Calendar, MapPin, Video, Copy, ChevronLeft, Camera } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function Confirmation({ registrationId }: { registrationId: string }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(registrationId);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleAddToCalendar = () => {
        // Generate a basic google calendar URL
        const title = encodeURIComponent("2026 International Women's Day");
        const details = encodeURIComponent("Join us for the 2026 International Women's Day. Theme: Give to Gain. Your registration ID is: " + registrationId);
        const location = encodeURIComponent("NCAA Conference Hall, NCAA Regional Office, Along MMIA Ikeja, Lagos");
        const dates = "20260307T090000Z/20260307T170000Z"; // 10:00 AM WAT is approx 09:00Z to 17:00Z

        window.open(`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${dates}`, "_blank");
    };

    return (
        <div className="w-full max-w-2xl mx-auto flex flex-col items-center bg-white/40 backdrop-blur-xl p-8 md:p-12 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.06)] ring-1 ring-brand-primary/10">

            {/* Success Animation */}
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className="text-brand-primary mb-6 drop-shadow-md"
            >
                <CheckCircle size={80} strokeWidth={1.5} />
            </motion.div>

            <h2 className="text-3xl md:text-4xl font-extrabold text-brand-dark mb-2 text-center">
                Registration Confirmed!
            </h2>
            <p className="text-brand-dark/70 text-center mb-8 text-lg">
                We&apos;ve sent a confirmation email with all the details. We look forward to seeing you there.
            </p>

            {/* Registration ID Pill */}
            <div className="bg-brand-light border border-brand-primary/20 px-6 py-3 rounded-full flex items-center gap-4 mb-10 shadow-sm relative group cursor-pointer" onClick={handleCopy}>
                <span className="text-brand-dark/50 text-sm font-semibold uppercase tracking-wider">ID</span>
                <span className="text-brand-primary font-mono font-bold text-lg">{registrationId || "EVT-WAITING..."}</span>
                <button className="text-brand-primary/60 hover:text-brand-primary transition-colors">
                    {copied ? <CheckCircle size={18} /> : <Copy size={18} />}
                </button>
            </div>

            {/* Event Details Recap Card */}
            <div className="w-full bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-brand-primary/10 space-y-6">
                <h3 className="text-xl font-bold text-brand-dark border-b border-brand-primary/10 pb-4">
                    Event Snapshot
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div className="flex items-start gap-4 text-brand-dark">
                            <div className="bg-brand-light p-3 rounded-xl text-brand-primary">
                                <Calendar size={22} />
                            </div>
                            <div>
                                <p className="font-bold text-brand-dark">March 07, 2026</p>
                                <p className="text-sm text-brand-dark/60 font-medium tracking-wide">10:00 AM Prompt</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 text-brand-dark">
                            <div className="bg-brand-light p-3 rounded-xl text-brand-primary">
                                <MapPin size={22} />
                            </div>
                            <div>
                                <p className="font-bold text-brand-dark">NCAA Conference Hall</p>
                                <p className="text-sm text-brand-dark/60 font-medium tracking-wide">NCAA Regional Office</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-start gap-4 text-brand-dark">
                            <div className="bg-brand-light p-3 rounded-xl text-brand-primary">
                                <Video size={22} />
                            </div>
                            <div>
                                <p className="font-bold text-brand-dark mb-1">Virtual Access</p>
                                <a
                                    href="#"
                                    className="text-brand-primary text-sm font-bold tracking-wide hover:underline inline-block break-all"
                                    target="_blank"
                                >
                                    Join via Zoom
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Selfie Banner Promotional Card */}
            <div className="w-full bg-brand-light/60 rounded-3xl p-6 md:p-8 mt-6 border border-brand-accent/20 shadow-sm relative overflow-hidden flex flex-col items-center text-center">
                <div className="absolute -top-10 -right-10 text-brand-accent/10">
                    <Camera size={120} />
                </div>
                <div className="bg-brand-accent/20 p-3 rounded-full text-brand-dark mb-4 drop-shadow-sm z-10">
                    <Camera size={28} className="text-brand-accent" />
                </div>
                <h3 className="text-xl font-extrabold text-brand-dark mb-2 z-10 font-sans">
                    Create Your Selfie Banner!
                </h3>
                <p className="text-brand-dark/70 text-sm font-medium mb-6 z-10 max-w-sm">
                    Show your support by creating a custom selfie banner and sharing it on your socials with the hashtag <span className="text-brand-primary font-bold">#GiveToGain</span>.
                </p>
                <a
                    href="https://getdp.co/vbH"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="z-10 py-3 px-8 bg-brand-accent text-white hover:text-brand-dark text-sm font-bold tracking-widest uppercase rounded-2xl shadow-lg hover:-translate-y-1 hover:shadow-brand-accent/40 hover:bg-white transition-all duration-300"
                >
                    Create My Banner
                </a>
            </div>

            {/* Actions */}
            <div className="w-full flex flex-col sm:flex-row gap-4 mt-8">
                <button
                    onClick={handleAddToCalendar}
                    className="flex-1 py-4 bg-brand-primary text-white text-md font-bold tracking-widest uppercase rounded-2xl shadow-lg shadow-brand-primary/30 hover:-translate-y-1 hover:shadow-xl hover:shadow-brand-primary/40 transition-all duration-300"
                >
                    Add to Calendar
                </button>
                <Link
                    href="/iwd-event"
                    className="flex-1 py-4 bg-white border border-brand-primary/20 text-brand-dark font-bold tracking-widest uppercase rounded-2xl flex items-center justify-center gap-2 hover:bg-brand-light transition-colors duration-300 shadow-sm"
                >
                    <ChevronLeft size={18} />
                    Back to Home
                </Link>
            </div>

        </div>
    );
}
