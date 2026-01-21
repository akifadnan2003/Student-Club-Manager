'use client'

import { useState } from "react";
import { createTask } from "@/app/actions/tasks";
import { X, Plus, Loader2 } from "lucide-react";
import { cn } from "@/utils/cn";

type Member = {
    id: string
    full_name: string | null
}

export function CreateTaskDialog({ members }: { members: Member[] }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{ text: string; error: boolean } | null>(null);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);
        setMessage(null);

        const formData = new FormData(event.currentTarget);
        const result = await createTask(null, formData);

        setIsLoading(false);
        setMessage({ text: result.message, error: result.error });

        if (!result.error) {
            event.currentTarget.reset();
            setTimeout(() => {
                setIsOpen(false);
                setMessage(null);
            }, 1500);
        }
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 bg-ulu-blue text-white px-4 py-2 rounded-lg hover:bg-ulu-blue/90 transition-colors font-medium text-sm"
            >
                <Plus className="h-4 w-4" />
                <span className="hidden md:inline">New Task</span>
                <span className="md:hidden">New</span>
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-ulu-surface border border-[#333] rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between p-4 border-b border-[#333] bg-[#222]">
                            <h2 className="font-semibold text-lg text-white">Create New Task</h2>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-gray-400 hover:text-white transition-colors p-1 rounded-md hover:bg-[#333]"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="p-6">
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
                                        placeholder="e.g. Design Event Flyers"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-ulu-text-secondary mb-1">Description (Optional)</label>
                                    <textarea
                                        name="description"
                                        rows={3}
                                        className="w-full px-3 py-2 bg-[#333] border border-[#444] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-ulu-blue focus:border-transparent resize-none"
                                        placeholder="Details about the task..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-ulu-text-secondary mb-1">Assign To</label>
                                    <select
                                        name="assignedTo"
                                        required
                                        className="w-full px-3 py-2 bg-[#333] border border-[#444] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-ulu-blue focus:border-transparent"
                                    >
                                        <option value="">Select a member...</option>
                                        {members.map(member => (
                                            <option key={member.id} value={member.id}>
                                                {member.full_name || 'Unknown'}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="pt-2">
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full bg-ulu-blue text-white font-bold py-2.5 rounded-lg hover:bg-ulu-blue/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                        {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Create Task"}
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
