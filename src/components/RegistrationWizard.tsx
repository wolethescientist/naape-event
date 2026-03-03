"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Info, PenSquare, CheckCircle, ArrowLeft } from "lucide-react";

import EventDetails from "./steps/EventDetails";
import RegistrationForm from "./steps/RegistrationForm";
import Confirmation from "./steps/Confirmation";
import clsx from "clsx";

export type AttendeeData = {
    firstName: string;
    surname: string;
    email: string;
    phone: string;
    attendanceMode: "Onsite" | "Online" | "";
    attendedBefore: "Yes" | "No" | "";
    joiningFrom: string;
    employer: string;
    organization: string;
    description: string;
    aviationRole: string;
    otherAviationRole?: string;
};

export default function RegistrationWizard() {
    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [direction, setDirection] = useState(1);
    const [registrationId, setRegistrationId] = useState("");

    const nextStep = () => {
        setDirection(1);
        setStep((prev) => (prev < 3 ? (prev + 1 as 1 | 2 | 3) : prev));
    };

    const prevStep = () => {
        setDirection(-1);
        setStep((prev) => (prev > 1 ? (prev - 1 as 1 | 2 | 3) : prev));
    };

    // Steps definition
    const steps = [
        { id: 1, label: "Event Details", icon: Info },
        { id: 2, label: "Register", icon: PenSquare },
        { id: 3, label: "Confirmation", icon: CheckCircle },
    ];

    return (
        <div className="w-full max-w-5xl flex flex-col items-center">
            {/* Step Progress Indicator (Only on step 1 and 2) */}
            <div className="w-full mb-8 pt-4">
                <div className="flex items-center justify-between relative max-w-2xl mx-auto">
                    {/* Progress Bar Background */}
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[2px] bg-brand-primary/10 -z-10" />
                    {/* Active Progress Bar */}
                    <motion.div
                        className="absolute left-0 top-1/2 -translate-y-1/2 h-[2px] bg-brand-primary -z-10"
                        animate={{ width: `${(step - 1) * 50}%` }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                    />

                    {steps.map((s) => {
                        const isCompleted = step > s.id;
                        const isActive = step === s.id;

                        return (
                            <div key={s.id} className="flex flex-col items-center gap-2">
                                <div
                                    className={clsx(
                                        "flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ring-4 ring-brand-light",
                                        isActive ? "border-brand-primary bg-brand-primary text-white scale-110 shadow-lg" :
                                            isCompleted ? "border-brand-primary bg-brand-primary text-white" :
                                                "border-brand-primary/20 bg-white text-brand-dark/40"
                                    )}
                                >
                                    {isCompleted ? <CheckCircle size={20} /> : <s.icon size={20} />}
                                </div>
                                <span className={clsx(
                                    "text-xs md:text-sm font-semibold tracking-wide uppercase mt-1",
                                    isActive ? "text-brand-primary" : "text-brand-dark/40"
                                )}>
                                    {s.label}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {step === 2 && (
                <button
                    onClick={prevStep}
                    className="self-start flex items-center gap-2 text-brand-dark/60 hover:text-brand-primary transition-colors font-semibold group mb-4 lg:ml-8"
                >
                    <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" />
                    Back to Event details
                </button>
            )}

            {/* Main Form container */}
            <div className="relative w-full">
                <AnimatePresence mode="wait" custom={direction}>
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            custom={direction}
                            initial={{ opacity: 0, x: -50 * direction }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 50 * direction }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                        >
                            <EventDetails onNext={nextStep} />
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div
                            key="step2"
                            custom={direction}
                            initial={{ opacity: 0, x: -50 * direction }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 50 * direction }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                        >
                            <RegistrationForm
                                onSuccess={(id) => {
                                    setRegistrationId(id);
                                    nextStep();
                                }}
                            />
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div
                            key="step3"
                            custom={direction}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.4, type: "spring", bounce: 0.4 }}
                        >
                            <Confirmation registrationId={registrationId} onReset={() => { setStep(1); setRegistrationId(""); }} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
