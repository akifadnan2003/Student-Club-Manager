'use client'

import { useState, useEffect } from "react";
import { createActivity } from "@/app/actions/activities";
import { X, Plus, Loader2 } from "lucide-react";
import { cn } from "@/utils/cn";
import { createClient } from "@/utils/supabase/client";

type Profile = {
    id: string
    full_name: string | null
    email: string
}

export function CreateActivityDialog() {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{ text: string; error: boolean } | null>(null);
    const [members, setMembers] = useState<Profile[]>([]);
    const [selectedLeads, setSelectedLeads] = useState<string[]>([]);

    useEffect(() => {
        if (isOpen) {
            fetchMembers();
        }
    }, [isOpen]);

    const fetchMembers = async () => {
        const supabase = createClient();
        const { data } = await supabase
            .from('profiles')
            .select('id, full_name, email')
            .order('full_name');

        if (data) setMembers(data);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);
        setMessage(null);

        const formData = new FormData(event.currentTarget);

        // Add selected leads to formData
        selectedLeads.forEach(leadId => {
            formData.append('leads', leadId);
        });

        const result = await createActivity(null, formData);

        setIsLoading(false);
        setMessage({ text: result.message, error: result.error });

        if (!result.error) {
            event.currentTarget.reset();
            setSelectedLeads([]);
            setTimeout(() => {
                setIsOpen(false);
                setMessage(null);
            }, 1500);
        }
    };

    const toggleLead = (userId: string) => {
        setSelectedLeads(prev =>
            prev.includes(userId)
                ? prev.filter(id => id !== userId)
                : [...prev, userId]
        );
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 bg-ulu-blue text-white px-4 py-2 rounded-lg hover:bg-ulu-blue/90 transition-colors font-medium text-sm"
            >
                <Plus className="h-4 w-4" />
                <span className="hidden md:inline">Create Activity</span>
                <span className="md:hidden">Create</span>
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-ulu-surface border border-[#333] rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
                        <div className="flex items-center justify-between p-4 border-b border-[#333] bg-[#222]">
                            <h2 className="font-semibold text-lg text-white">Create Activity</h2>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-gray-400 hover:text-white transition-colors p-1 rounded-md hover:bg-[#333]"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto">
                            {message && (
                                <div className={cn(
                                    "mb-4 p-3 rounded-lg text-sm text-center font-medium",
                                    message.error ? "bg-red-900/30 text-red-400 border border-red-900/50" : "bg-green-900/30 text-green-400 border border-green-900/50"
                                )}>
                                    {message.text}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-ulu-text-secondary mb-1">Title</label>
                                    <input
                                        name="title"
                                        required
                                        className="w-full px-3 py-2 bg-[#333] border border-[#444] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-ulu-blue focus:border-transparent"
                                        placeholder="e.g. Movie Night"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-ulu-text-secondary mb-1">Date</label>
                                    <input
                                        name="date"
                                        type="datetime-local"
                                        required
                                        className="w-full px-3 py-2 bg-[#333] border border-[#444] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-ulu-blue focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-ulu-text-secondary mb-1">Status</label>
                                    <select
                                        name="status"
                                        className="w-full px-3 py-2 bg-[#333] border border-[#444] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-ulu-blue focus:border-transparent"
                                    >
                                        <option value="upcoming">Upcoming</option>
                                        <option value="done">Done</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-ulu-text-secondary mb-1">Description</label>
                                    <textarea
                                        name="description"
                                        rows={3}
                                        className="w-full px-3 py-2 bg-[#333] border border-[#444] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-ulu-blue focus:border-transparent"
                                        placeholder="Activity details..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-ulu-text-secondary mb-2">Leads (Optional)</label>
                                    <div className="max-h-40 overflow-y-auto space-y-2 border border-[#444] rounded-lg p-2 bg-[#222]">
                                        {members.map(member => (
                                            <label
                                                key={member.id}
                                                className="flex items-center gap-2 p-2 rounded hover:bg-[#333] cursor-pointer"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={selectedLeads.includes(member.id)}
                                                    onChange={() => toggleLead(member.id)}
                                                    className="rounded border-gray-600 text-ulu-blue focus:ring-ulu-blue focus:ring-offset-0"
                                                />
                                                <span className="text-sm text-white">
                                                    {member.full_name || member.email}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                    {selectedLeads.length > 0 && (
                                        <p className="text-xs text-ulu-text-secondary mt-1">
                                            {selectedLeads.length} lead{selectedLeads.length > 1 ? 's' : ''} selected
                                        </p>
                                    )}
                                </div>

                                <div className="pt-2">
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full bg-ulu-blue text-white font-bold py-2.5 rounded-lg hover:bg-ulu-blue/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                        {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Create Activity"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
