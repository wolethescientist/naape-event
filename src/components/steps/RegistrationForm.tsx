"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    User, Mail, Phone, MapPin, Briefcase, Building2,
    ChevronDown, Plane, CheckCircle, AlertCircle, Users
} from "lucide-react";
import clsx from "clsx";
import type { AttendeeData } from "../RegistrationWizard";

const AVIATION_ROLES = [
    "Pilot", "Cabin Attendant", "Aircraft Maintenance Engineer",
    "Dispatcher", "Air Traffic Control", "ATSEP", "Av.Sec", "Other"
];

const DESCRIPTIONS = [
    "Aviation/Aerospace Professional", "Student", "Mentor/Coach",
    "Press/Journalist", "Enthusiast", "Other"
];

export default function RegistrationForm({ onSuccess }: { onSuccess: (id: string) => void }) {
    const [formData, setFormData] = useState<AttendeeData>({
        firstName: "",
        surname: "",
        email: "",
        phone: "",
        attendanceMode: "",
        attendedBefore: "",
        joiningFrom: "",
        employer: "",
        organization: "",
        description: "",
        aviationRole: "",
    });

    const [errors, setErrors] = useState<Partial<Record<keyof AttendeeData, string>>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [capacity, setCapacity] = useState<{ onsiteCount: number; onsiteLimit: number; onsiteAvailable: boolean } | null>(null);
    const [submitError, setSubmitError] = useState("");

    useEffect(() => {

        const fetchCapacity = async () => {
            try {
                const res = await fetch("/api/register/capacity");
                const data = await res.json();
                setCapacity(data);
                if (!data.onsiteAvailable && formData.attendanceMode === "Onsite") {
                    setFormData(prev => ({ ...prev, attendanceMode: "Online" }));
                }
            } catch (err) {
                console.error("Failed to fetch capacity", err);
            }
        };
        fetchCapacity();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name as keyof AttendeeData]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    const validate = () => {
        const newErrors: Partial<Record<keyof AttendeeData, string>> = {};
        if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
        if (!formData.surname.trim()) newErrors.surname = "Surname is required";
        if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Valid email is required";
        if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
        if (!formData.attendanceMode) newErrors.attendanceMode = "Please select attendance mode";
        if (!formData.attendedBefore) newErrors.attendedBefore = "Please select an option";
        if (!formData.joiningFrom.trim()) newErrors.joiningFrom = "Location is required";
        if (!formData.employer.trim()) newErrors.employer = "Employer is required";
        if (!formData.organization.trim()) newErrors.organization = "Organization is required";
        if (!formData.description) newErrors.description = "Please select a description";
        if (formData.description === "Aviation/Aerospace Professional" && !formData.aviationRole) {
            newErrors.aviationRole = "Please select your aviation role";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitError("");
        if (!validate()) return;

        setIsSubmitting(true);
        try {
            // Re-check capacity right before submitting in case it filled up
            if (formData.attendanceMode === "Onsite") {
                const capRes = await fetch("/api/register/capacity");
                const capData = await capRes.json();
                if (!capData.onsiteAvailable) {
                    setCapacity(capData);
                    setFormData(prev => ({ ...prev, attendanceMode: "" }));
                    setSubmitError("Onsite capacity just filled up! Please select Online attendance instead.");
                    setIsSubmitting(false);
                    return;
                }
            }

            const res = await fetch("/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.error || "Something went wrong.");
            }
            onSuccess(data.registrationId);
        } catch (error: unknown) {
            if (error instanceof Error) {
                setSubmitError(error.message);
            } else {
                setSubmitError("Unknown error occurred.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const isAviationPro = formData.description === "Aviation/Aerospace Professional";

    return (
        <div className="w-full bg-white/60 backdrop-blur-xl p-6 md:p-10 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.06)] ring-1 ring-brand-primary/10">
            <div className="mb-8 text-center md:text-left">
                <h2 className="text-3xl font-extrabold text-brand-dark mb-2">Attendee Information</h2>
                <p className="text-brand-dark/60 font-medium">Please fill in your details to secure your spot.</p>
            </div>

            {submitError && (
                <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 flex items-center gap-3">
                    <AlertCircle size={20} />
                    <span className="font-semibold">{submitError}</span>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Name Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FieldWrapper label="First Name" icon={<User size={18} />} error={errors.firstName}>
                        <input
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            placeholder="Jane"
                            className={inputClasses(!!errors.firstName)}
                        />
                    </FieldWrapper>
                    <FieldWrapper label="Surname" icon={<User size={18} />} error={errors.surname}>
                        <input
                            name="surname"
                            value={formData.surname}
                            onChange={handleChange}
                            placeholder="Doe"
                            className={inputClasses(!!errors.surname)}
                        />
                    </FieldWrapper>
                </div>

                {/* Contact Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FieldWrapper label="Email Address" icon={<Mail size={18} />} error={errors.email}>
                        <input
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="jane@example.com"
                            className={inputClasses(!!errors.email)}
                        />
                    </FieldWrapper>
                    <FieldWrapper label="Phone Number" icon={<Phone size={18} />} error={errors.phone}>
                        <input
                            name="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="+234 800 000 0000"
                            className={inputClasses(!!errors.phone)}
                        />
                    </FieldWrapper>
                </div>

                {/* Attendance Mode */}
                <div className="space-y-4">
                    <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-dark/70 ml-1">
                        <Users size={18} /> Mode of Attendance
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <RadioCard
                            selected={formData.attendanceMode === "Onsite"}
                            onClick={() => {
                                if (capacity?.onsiteAvailable) {
                                    setFormData(prev => ({ ...prev, attendanceMode: "Onsite" }));
                                    setErrors(prev => ({ ...prev, attendanceMode: undefined }));
                                }
                            }}
                            disabled={capacity ? !capacity.onsiteAvailable : false}
                            title="Onsite Attendance"
                            description={capacity && !capacity.onsiteAvailable
                                ? "Onsite registration is full (180/180 seats taken). Only virtual attendance is available."
                                : "Join us in-person at the Lagos Aviation Center"}
                            icon="🏢"
                        />
                        <RadioCard
                            selected={formData.attendanceMode === "Online"}
                            onClick={() => {
                                setFormData(prev => ({ ...prev, attendanceMode: "Online" }));
                                setErrors(prev => ({ ...prev, attendanceMode: undefined }));
                            }}
                            title="Online Attendance"
                            description="Join the conference virtually via Zoom"
                            icon="💻"
                        />
                    </div>
                    {errors.attendanceMode && (
                        <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 text-sm font-semibold ml-2">
                            {errors.attendanceMode}
                        </motion.p>
                    )}
                </div>

                {/* Attended Before */}
                <div className="space-y-4">
                    <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-dark/70 ml-1">
                        <CheckCircle size={18} /> Have you attended this event before?
                    </label>
                    <div className="flex gap-4">
                        <button
                            type="button"
                            onClick={() => {
                                setFormData(prev => ({ ...prev, attendedBefore: "Yes" }));
                                setErrors(prev => ({ ...prev, attendedBefore: undefined }));
                            }}
                            className={clsx(
                                "flex-1 py-4 rounded-xl border-2 transition-all duration-300 font-bold tracking-wide",
                                formData.attendedBefore === "Yes"
                                    ? "border-brand-primary bg-brand-light text-brand-primary shadow-sm"
                                    : "border-brand-primary/10 bg-white/50 text-brand-dark/60 hover:border-brand-primary/30"
                            )}
                        >
                            Yes
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setFormData(prev => ({ ...prev, attendedBefore: "No" }));
                                setErrors(prev => ({ ...prev, attendedBefore: undefined }));
                            }}
                            className={clsx(
                                "flex-1 py-4 rounded-xl border-2 transition-all duration-300 font-bold tracking-wide",
                                formData.attendedBefore === "No"
                                    ? "border-brand-primary bg-brand-light text-brand-primary shadow-sm"
                                    : "border-brand-primary/10 bg-white/50 text-brand-dark/60 hover:border-brand-primary/30"
                            )}
                        >
                            No
                        </button>
                    </div>
                    {errors.attendedBefore && (
                        <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 text-sm font-semibold ml-2">
                            {errors.attendedBefore}
                        </motion.p>
                    )}
                </div>

                {/* Location & Work */}
                <FieldWrapper label="Where are you joining from?" icon={<MapPin size={18} />} error={errors.joiningFrom}>
                    <input
                        name="joiningFrom"
                        value={formData.joiningFrom}
                        onChange={handleChange}
                        placeholder="City, Country"
                        className={inputClasses(!!errors.joiningFrom)}
                    />
                </FieldWrapper>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FieldWrapper label="Employer" icon={<Building2 size={18} />} error={errors.employer}>
                        <input
                            name="employer"
                            value={formData.employer}
                            onChange={handleChange}
                            placeholder="Company Name"
                            className={inputClasses(!!errors.employer)}
                        />
                    </FieldWrapper>
                    <FieldWrapper label="Organization" icon={<Briefcase size={18} />} error={errors.organization}>
                        <input
                            name="organization"
                            value={formData.organization}
                            onChange={handleChange}
                            placeholder="Organization / Group"
                            className={inputClasses(!!errors.organization)}
                        />
                    </FieldWrapper>
                </div>

                {/* Dropdowns */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
                    <FieldWrapper label="What best describes you?" icon={<User size={18} />} error={errors.description}>
                        <CustomSelect
                            value={formData.description}
                            onChange={(val) => handleChange({ target: { name: "description", value: val } } as any)}
                            options={DESCRIPTIONS}
                            placeholder="Select an option"
                            hasError={!!errors.description}
                        />
                    </FieldWrapper>

                    <AnimatePresence>
                        {isAviationPro && (
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3, ease: "easeInOut" }}
                            >
                                <div className="pt-0 h-full flex flex-col justify-end">
                                    <FieldWrapper label="Aviation Role" icon={<Plane size={18} />} error={errors.aviationRole}>
                                        <CustomSelect
                                            value={formData.aviationRole}
                                            onChange={(val) => handleChange({ target: { name: "aviationRole", value: val } } as any)}
                                            options={AVIATION_ROLES}
                                            placeholder="Select your role"
                                            hasError={!!errors.aviationRole}
                                        />
                                    </FieldWrapper>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Submit */}
                <div className="pt-6 border-t border-brand-primary/10">
                    <motion.button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-5 bg-brand-primary text-white text-lg font-bold tracking-widest uppercase rounded-2xl shadow-lg shadow-brand-primary/30 hover:-translate-y-1 hover:shadow-xl hover:shadow-brand-primary/40 transition-all duration-300 disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:shadow-lg disabled:cursor-not-allowed flex justify-center items-center gap-3 relative overflow-hidden group"
                        whileTap={{ scale: 0.98 }}
                    >
                        {isSubmitting ? (
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full"
                            />
                        ) : (
                            <>
                                <span>Complete Registration</span>
                                <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 rounded-2xl" />
                            </>
                        )}
                    </motion.button>
                </div>
            </form>
        </div>
    );
}

// Helpers
const inputClasses = (hasError: boolean) => clsx(
    "w-full px-5 py-4 rounded-xl border-2 transition-all duration-300 outline-none text-brand-dark font-medium bg-white/50",
    hasError
        ? "border-red-400 focus:border-red-500 focus:shadow-[0_0_0_4px_rgba(248,113,113,0.2)]"
        : "border-brand-primary/10 focus:border-brand-primary focus:bg-white focus:shadow-[0_0_0_4px_rgba(99,102,241,0.1)] hover:border-brand-primary/30"
);

function FieldWrapper({ label, icon, error, children }: { label: string, icon: React.ReactNode, error?: string, children: React.ReactNode }) {
    return (
        <div className="flex flex-col space-y-2">
            <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-dark/70 ml-1">
                <span className="text-brand-primary">{icon}</span>
                {label}
            </label>
            {children}
            {error && (
                <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 text-sm font-semibold ml-2">
                    {error}
                </motion.p>
            )}
        </div>
    );
}

function RadioCard({
    selected,
    onClick,
    title,
    description,
    icon,
    disabled
}: {
    selected: boolean, onClick: () => void, title: string, description: string, icon: string, disabled?: boolean
}) {
    return (
        <div
            onClick={disabled ? undefined : onClick}
            className={clsx(
                "relative p-5 rounded-2xl border-2 transition-all duration-300 flex items-start gap-4",
                disabled ? "opacity-50 cursor-not-allowed bg-gray-50 border-gray-200" : "cursor-pointer hover:-translate-y-1 hover:shadow-md",
                selected
                    ? "border-brand-primary bg-brand-light shadow-sm"
                    : disabled ? "" : "border-brand-primary/10 bg-white/50 hover:border-brand-primary/30"
            )}
        >
            <div className="text-3xl mt-1">{icon}</div>
            <div className="flex-1">
                <h4 className={clsx("font-bold mb-1", selected ? "text-brand-primary" : "text-brand-dark")}>
                    {title}
                </h4>
                <p className={clsx("text-sm font-medium leading-relaxed", selected ? "text-brand-primary/80" : "text-brand-dark/60", disabled && "text-red-600/80 font-semibold")}>
                    {description}
                </p>
            </div>
            {selected && (
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-4 right-4 text-brand-primary"
                >
                    <CheckCircle size={24} />
                </motion.div>
            )}
        </div>
    );
}

function CustomSelect({
    value,
    options,
    onChange,
    placeholder,
    hasError,
}: {
    value: string;
    options: string[];
    onChange: (val: string) => void;
    placeholder: string;
    hasError: boolean;
}) {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={ref}>
            <div
                onClick={() => setIsOpen(!isOpen)}
                className={clsx(
                    inputClasses(hasError),
                    "flex items-center justify-between cursor-pointer"
                )}
            >
                <span className={clsx("truncate", value ? "text-brand-dark font-medium" : "text-brand-dark/50")}>
                    {value || placeholder}
                </span>
                <motion.div animate={{ rotate: isOpen ? 180 : 0 }} className="flex-shrink-0 ml-2">
                    <ChevronDown size={20} className="text-brand-dark/40" />
                </motion.div>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute z-50 w-full mt-2 bg-white/95 backdrop-blur-xl rounded-xl shadow-xl border border-brand-primary/10 overflow-hidden"
                    >
                        <div className="max-h-60 overflow-y-auto custom-scrollbar">
                            {options.map((option) => (
                                <div
                                    key={option}
                                    onClick={() => {
                                        onChange(option);
                                        setIsOpen(false);
                                    }}
                                    className={clsx(
                                        "px-5 py-3 cursor-pointer transition-colors duration-200 font-medium",
                                        value === option
                                            ? "bg-brand-primary/10 text-brand-primary font-bold"
                                            : "text-brand-dark/80 hover:bg-brand-light hover:text-brand-primary"
                                    )}
                                >
                                    {option}
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
