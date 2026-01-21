'use client'

import { useState } from "react";
import { Calendar, Users, X } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/utils/cn";

type Activity = {
    id: string
    title: string
    description: string | null
    date: string
    status: string
    created_by: string | null
    created_at: string
    updated_at: string
    activity_leads: Array<{
        user_id: string
        profiles: {
            id: string
            full_name: string | null
            email: string
        } | null
    }>
}

type ActivityCardProps = {
    activity: Activity
}

export function ActivityCard({ activity }: ActivityCardProps) {
    const [showDetails, setShowDetails] = useState(false);

    const leads = activity.activity_leads
        .map(lead => lead.profiles)
        .filter((profile): profile is NonNullable<typeof profile> => profile !== null);

    return (
        <>
            <div
                onClick={() => setShowDetails(true)}
                className="bg-ulu-surface border border-[#333] rounded-lg p-4 hover:border-ulu-blue transition-colors cursor-pointer"
            >
                <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-white">{activity.title}</h3>
                    <span className={cn(
                        "px-2 py-1 rounded text-xs font-medium",
                        activity.status === 'upcoming'
                            ? "bg-ulu-blue/20 text-ulu-blue border border-ulu-blue/30"
                            : "bg-green-900/20 text-green-400 border border-green-900/30"
                    )}>
                        {activity.status === 'upcoming' ? 'Upcoming' : 'Done'}
                    </span>
                </div>

                <div className="flex items-center gap-2 text-sm text-ulu-text-secondary mb-2">
                    <Calendar className="h-4 w-4" />
                    <span>{format(new Date(activity.date), 'MMM d, yyyy')}</span>
                </div>

                {leads.length > 0 && (
                    <div className="flex items-center gap-2 text-sm text-ulu-text-secondary">
                        <Users className="h-4 w-4" />
                        <span>{leads.length} lead{leads.length > 1 ? 's' : ''}</span>
                    </div>
                )}
            </div>

            {/* Details Modal */}
            {showDetails && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-ulu-surface border border-[#333] rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between p-4 border-b border-[#333] bg-[#222]">
                            <h3 className="font-semibold text-white">{activity.title}</h3>
                            <button onClick={() => setShowDetails(false)} className="text-gray-400 hover:text-white">
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div>
                                <label className="text-sm font-medium text-ulu-text-secondary">Date</label>
                                <p className="text-white mt-1">{format(new Date(activity.date), 'MMMM d, yyyy')}</p>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-ulu-text-secondary">Status</label>
                                <p className="text-white mt-1 capitalize">{activity.status}</p>
                            </div>

                            {activity.description && (
                                <div>
                                    <label className="text-sm font-medium text-ulu-text-secondary">Description</label>
                                    <p className="text-white mt-1">{activity.description}</p>
                                </div>
                            )}

                            {leads.length > 0 && (
                                <div>
                                    <label className="text-sm font-medium text-ulu-text-secondary">Leading This Activity</label>
                                    <div className="mt-2 space-y-2">
                                        {leads.map(lead => (
                                            <div key={lead.id} className="flex items-center gap-2 text-sm">
                                                <div className="h-8 w-8 rounded-full bg-ulu-blue/20 flex items-center justify-center text-ulu-blue font-medium">
                                                    {lead.full_name?.charAt(0) || lead.email.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="text-white">{lead.full_name || 'Unknown'}</p>
                                                    <p className="text-xs text-ulu-text-secondary">{lead.email}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
