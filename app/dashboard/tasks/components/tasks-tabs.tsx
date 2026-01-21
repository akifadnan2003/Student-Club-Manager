'use client'

import { useState } from "react";
import { TaskList } from "./task-list";
import { cn } from "@/utils/cn";

type Task = {
    id: string
    title: string
    description: string | null
    status: 'pending' | 'submitted' | 'verified'
    created_at: string
    assignee: { full_name: string | null } | null
    creator: { full_name: string | null } | null
}

export function TasksTabs({
    pending,
    submitted,
    verified,
    currentUserId,
    userRole
}: {
    pending: Task[],
    submitted: Task[],
    verified: Task[],
    currentUserId: string,
    userRole: string
}) {
    const [activeTab, setActiveTab] = useState<'pending' | 'submitted' | 'verified'>('pending');

    const tabs = [
        { id: 'pending', label: 'Pending', count: pending.length },
        { id: 'submitted', label: 'Submitted', count: submitted.length },
        { id: 'verified', label: 'Verified', count: verified.length },
    ] as const;

    return (
        <div className="space-y-6">
            {/* Tab Navigation */}
            <div className="flex p-1 space-x-1 bg-ulu-surface border border-[#333] rounded-xl w-fit">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={cn(
                            "flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg transition-all",
                            activeTab === tab.id
                                ? "bg-[#333] text-white shadow-sm"
                                : "text-ulu-text-secondary hover:text-white hover:bg-[#333]/50"
                        )}
                    >
                        {tab.label}
                        {tab.count > 0 && (
                            <span className={cn(
                                "px-2 py-0.5 rounded-full text-[10px]",
                                activeTab === tab.id ? "bg-ulu-blue text-white" : "bg-[#444] text-gray-300"
                            )}>
                                {tab.count}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* Tab Panels */}
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                {activeTab === 'pending' && <TaskList tasks={pending} currentUserId={currentUserId} userRole={userRole} />}
                {activeTab === 'submitted' && <TaskList tasks={submitted} currentUserId={currentUserId} userRole={userRole} />}
                {activeTab === 'verified' && <TaskList tasks={verified} currentUserId={currentUserId} userRole={userRole} />}
            </div>
        </div>
    );
}
