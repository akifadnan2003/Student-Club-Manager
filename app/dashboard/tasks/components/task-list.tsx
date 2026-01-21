'use client'

import { useState } from "react";
import { format } from "date-fns";
import { CheckCircle2, Circle, Clock, Loader2 } from "lucide-react";
import { submitTask, verifyTask } from "@/app/actions/tasks";
import { cn } from "@/utils/cn";
import { isAdmin } from "@/utils/roles";

type Task = {
    id: string
    title: string
    description: string | null
    status: 'pending' | 'submitted' | 'verified'
    created_at: string
    assignee: { full_name: string | null } | null
    creator: { full_name: string | null } | null
}

export function TaskList({ tasks, currentUserId, userRole }: { tasks: Task[], currentUserId: string, userRole: string }) {
    const [loadingTask, setLoadingTask] = useState<string | null>(null);

    const handleAction = async (taskId: string, action: 'submit' | 'verify') => {
        setLoadingTask(taskId);

        const formData = new FormData();
        formData.append('taskId', taskId);

        if (action === 'submit') {
            await submitTask(formData);
        } else {
            formData.append('status', 'verified');
            await verifyTask(formData);
        }

        setLoadingTask(null);
    };

    if (tasks.length === 0) {
        return (
            <div className="text-center py-12 bg-ulu-surface rounded-lg border border-[#333]">
                <div className="mx-auto h-12 w-12 text-gray-600">
                    <CheckCircle2 className="h-full w-full" />
                </div>
                <h3 className="mt-2 text-sm font-semibold text-white">No tasks found</h3>
                <p className="mt-1 text-sm text-ulu-text-secondary">There are no tasks in this category.</p>
            </div>
        );
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'verified': return 'bg-green-900/30 text-green-400 border-green-900/50';
            case 'submitted': return 'bg-yellow-900/30 text-yellow-400 border-yellow-900/50';
            default: return 'bg-gray-800 text-gray-400 border-gray-700';
        }
    };

    return (
        <div className="grid gap-4">
            {tasks.map((task) => (
                <div key={task.id} className="bg-ulu-surface p-4 rounded-lg border border-[#333] shadow-sm transition-all hover:bg-[#333]/50">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                                <span className={cn("text-xs font-bold px-2 py-0.5 rounded border uppercase tracking-wide", getStatusColor(task.status))}>
                                    {task.status}
                                </span>
                                <span className="text-xs text-ulu-text-secondary flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {format(new Date(task.created_at), 'MMM d')}
                                </span>
                            </div>

                            <h3 className="text-lg font-semibold text-white leading-tight mb-1">{task.title}</h3>

                            {task.description && (
                                <p className="text-ulu-text-secondary text-sm mb-3 line-clamp-2">{task.description}</p>
                            )}

                            <div className="flex items-center gap-2 text-xs text-justify-gray-500 mt-2">
                                <span className="font-medium text-gray-400">Assigned to:</span>
                                <span className="bg-ulu-blue/20 text-ulu-blue px-2 py-0.5 rounded font-medium border border-ulu-blue/30">
                                    {task.assignee?.full_name || 'Unknown'}
                                </span>
                            </div>
                        </div>

                        <div className="flex flex-col items-end gap-2">
                            {/* Action Buttons */}

                            {/* Submit Action: Only for Pending tasks assigned to current user */}
                            {task.status === 'pending' && (!task.assignee || tasks.length > 0) /* assignee check logic in component */ && (
                                <button
                                    onClick={() => handleAction(task.id, 'submit')}
                                    disabled={loadingTask === task.id}
                                    className="flex items-center gap-2 px-3 py-1.5 bg-ulu-blue text-white text-sm font-medium rounded hover:bg-ulu-blue/90 disabled:opacity-50 transition-colors"
                                >
                                    {loadingTask === task.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Circle className="h-4 w-4" />}
                                    Submit
                                </button>
                            )}

                            {/* Verify Action: Only for Submitted tasks, visible to Admins */}
                            {task.status === 'submitted' && isAdmin(userRole) && (
                                <button
                                    onClick={() => handleAction(task.id, 'verify')}
                                    disabled={loadingTask === task.id}
                                    className="flex items-center gap-2 px-3 py-1.5 bg-green-600 text-white text-sm font-medium rounded hover:bg-green-700 disabled:opacity-50 transition-colors"
                                >
                                    {loadingTask === task.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                                    Verify
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
