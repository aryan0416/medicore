"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Loader2, Stethoscope, ChevronDown, Activity } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { usePatients } from "@/features/patients/hooks/usePatients";

type Message = {
    id: string;
    role: "user" | "assistant";
    content: string;
    sources?: string[];
};

export default function AIChatPage() {
    const supabase = createClient();

    // Fetch patients for context dropdown
    const { data: patientsData } = usePatients({ limit: 50 });
    const patients = patientsData?.data || [];

    const [selectedPatientId, setSelectedPatientId] = useState<string>("");

    // Chat state
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "1",
            role: "assistant",
            content: "Hello! I am MediCore's Clinical AI Assistant. Select a patient context above or ask a general clinical question.",
        },
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: "user",
            content: input.trim(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        try {
            const { data: { session } } = await supabase.auth.getSession();
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

            const requestBody = {
                query: userMessage.content,
                // Include patient_id only if one is selected
                ...(selectedPatientId ? { patient_id: selectedPatientId } : {})
            };

            const response = await fetch(`${apiUrl}/api/ai/chat`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...(session ? { Authorization: `Bearer ${session.access_token}` } : {}),
                },
                body: JSON.stringify(requestBody),
            });

            const data = await response.json();

            if (data.success && data.data) {
                const aiMessage: Message = {
                    id: (Date.now() + 1).toString(),
                    role: "assistant",
                    content: data.data.answer || "I received a response, but it was empty.",
                    sources: data.data.sources,
                };
                setMessages((prev) => [...prev, aiMessage]);
            } else {
                throw new Error(data.message || "Failed to get response");
            }
        } catch (error) {
            console.error(error);
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: "Sorry, I encountered an error while trying to process your request.",
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-theme(spacing.24))] xl:h-[calc(100vh-theme(spacing.20))] max-w-5xl mx-auto animate-fade-in relative px-2 lg:px-4">

            {/* Header / Context Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-border">
                <div className="flex items-center gap-4">
                    <div
                        className="w-12 h-12 rounded-[14px] flex items-center justify-center shadow-sm gradient-teal"
                    >
                        <Bot size={24} className="text-white" />
                    </div>
                    <div>
                        <h1 className="font-display font-bold text-3xl text-foreground tracking-tight">
                            Clinical AI
                        </h1>
                        <p className="text-[14px] font-medium text-muted-foreground flex items-center gap-1.5 mt-0.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            RAG Pipeline Active
                        </p>
                    </div>
                </div>

                {/* Patient Context Selector */}
                <div className="flex items-center gap-3 bg-white border border-border px-4 py-3 rounded-xl shadow-sm hover:border-gray-300 transition-colors">
                    <div className="flex items-center gap-2 text-[14px] font-bold text-muted-foreground uppercase tracking-wider border-r border-border pr-4">
                        <Activity size={16} className="text-emerald-500" />
                        Context
                    </div>
                    <div className="relative">
                        <select
                            value={selectedPatientId || ""}
                            onChange={(e) => setSelectedPatientId(e.target.value)}
                            className="bg-muted px-4 py-2 rounded-full text-sm font-medium border-none shadow-sm focus:ring-2 focus:ring-primary/20 appearance-none min-w-[180px]"
                        >
                            <option value="">General (No Patient)</option>
                            {patients.map((p: any) => (
                                <option key={p.id} value={p.id}>
                                    {p.firstName} {p.lastName} ({p.uhid})
                                </option>
                            ))}
                        </select>
                        <ChevronDown size={14} className="absolute right-0 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                    </div>
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto pr-2 sm:pr-4 mb-4 space-y-6 scrollbar-hide flex flex-col pt-4">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`flex gap-3 sm:gap-4 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                        {msg.role === "assistant" && (
                            <div
                                className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shadow-sm gradient-teal"
                            >
                                <Stethoscope className="text-white w-4 h-4 sm:w-5 sm:h-5" />
                            </div>
                        )}

                        <div className={`flex flex-col max-w-[85%] sm:max-w-[75%] ${msg.role === "user" ? "items-end" : "items-start"}`}>
                            <div
                                className={`px-4 sm:px-5 py-3 sm:py-3.5 rounded-2xl shadow-sm text-[15px] leading-relaxed ${msg.role === "user"
                                    ? "text-white rounded-br-sm gradient-teal"
                                    : "bg-white border border-border text-foreground rounded-bl-sm"
                                    }`}
                            >
                                {msg.content}
                            </div>

                            {/* Sources badges if available */}
                            {msg.sources && msg.sources.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-2.5">
                                    <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mt-0.5 sm:mt-1 mr-1">
                                        Sources:
                                    </span>
                                    {msg.sources.map((source, idx) => (
                                        <span
                                            key={idx}
                                            className="px-2.5 py-1 text-[11px] font-bold rounded-md bg-muted text-muted-foreground border border-border"
                                        >
                                            {source}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        {msg.role === "user" && (
                            <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-muted flex items-center justify-center shadow-sm border border-border">
                                <User className="text-foreground w-4 h-4 sm:w-5 sm:h-5" />
                            </div>
                        )}
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="relative mt-auto shrink-0 pb-4">
                <form
                    onSubmit={handleSubmit}
                    className="flex items-center gap-3 bg-white p-2.5 rounded-[20px] shadow-sm border border-border transition-all duration-300 hover:shadow-md focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary"
                >
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={selectedPatientId ? `Ask a question regarding the selected patient...` : "Ask a general clinical question..."}
                        disabled={isLoading}
                        className="flex-1 bg-transparent px-4 py-2 placeholder:text-muted-foreground/70 text-foreground outline-none text-[15px] font-medium"
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !input.trim()}
                        className="p-3.5 text-white rounded-xl transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden gradient-teal hover:-translate-y-0.5"
                    >
                        {isLoading ? (
                            <Loader2 className="w-5 h-5 animate-spin relative z-10" />
                        ) : (
                            <Send className="w-5 h-5 group-hover:scale-110 transition-transform relative z-10" />
                        )}
                    </button>
                </form>
                <div className="text-center mt-3">
                    <span className="text-[11px] text-muted-foreground font-semibold">
                        MediCore AI can make mistakes. Always verify clinical information and guidelines.
                    </span>
                </div>
            </div>
        </div>
    );
}
