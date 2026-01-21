'use client'

import { useState } from "react";
import { ActivityCard } from "./activity-card";

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

type ActivitiesListProps = {
    activities: Activity[]
}

export function ActivitiesList({ activities }: ActivitiesListProps) {
    const [filter, setFilter] = useState<'all' | 'upcoming' | 'done'>('all');

    const filteredActivities = activities.filter(activity => {
        if (filter === 'all') return true;
        return activity.status === filter;
    });

    return (
        <div className="space-y-4">
            {/* Filter Tabs */}
            <div className="flex gap-2 border-b border-[#333]">
                <button
                    onClick={() => setFilter('all')}
                    className={`px-4 py-2 text-sm font-medium transition-colors ${filter === 'all'
                        ? 'text-white border-b-2 border-ulu-blue'
                        : 'text-ulu-text-secondary hover:text-white'
                        }`}
                >
                    All
                </button>
                <button
                    onClick={() => setFilter('upcoming')}
                    className={`px-4 py-2 text-sm font-medium transition-colors ${filter === 'upcoming'
                        ? 'text-white border-b-2 border-ulu-blue'
                        : 'text-ulu-text-secondary hover:text-white'
                        }`}
                >
                    Upcoming
                </button>
                <button
                    onClick={() => setFilter('done')}
                    className={`px-4 py-2 text-sm font-medium transition-colors ${filter === 'done'
                        ? 'text-white border-b-2 border-ulu-blue'
                        : 'text-ulu-text-secondary hover:text-white'
                        }`}
                >
                    Done
                </button>
            </div>

            {/* Activities Grid */}
            {filteredActivities.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-ulu-text-secondary">No activities found</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredActivities.map(activity => (
                        <ActivityCard key={activity.id} activity={activity} />
                    ))}
                </div>
            )}
        </div>
    );
}
