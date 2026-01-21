import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { isAdmin, isSuperAdmin, ROLE_LABELS, ROLES } from "@/utils/roles";

export default async function DashboardPage() {
    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect('/login');

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

    const role = profile?.role || 'member';

    // Fetch pending tasks count
    let pendingTasksCount = 0;

    // For admins, count all pending. For members, count their assigned pending.
    let countQuery = supabase
        .from('tasks')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

    if (!isAdmin(role)) {
        countQuery = countQuery.eq('assigned_to', user.id);
    }

    const { count } = await countQuery;
    pendingTasksCount = count || 0;

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-white">Dashboard</h1>

            {/* Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Pending Tasks Widget */}
                <div className="bg-ulu-surface p-6 rounded-lg shadow-sm border border-[#333]">
                    <h2 className="text-lg font-semibold mb-2 text-white">Pending Tasks</h2>
                    <p className="text-3xl font-bold text-ulu-blue">{pendingTasksCount}</p>
                    <p className="text-sm text-ulu-text-secondary mt-1">
                        {isAdmin(role) ? "Tasks waiting for completion" : "Tasks assigned to you"}
                    </p>
                </div>

                {/* Activity Widget (Placeholder) */}
                <div className="bg-ulu-surface p-6 rounded-lg shadow-sm border border-[#333]">
                    <h2 className="text-lg font-semibold mb-2 text-white">Next Activity</h2>
                    <p className="text-ulu-text-secondary">No activities scheduled</p>
                </div>

                {/* Role Widget */}
                <div className="bg-ulu-surface p-6 rounded-lg shadow-sm border border-[#333]">
                    <h2 className="text-lg font-semibold mb-2 text-white">My Role</h2>
                    {isSuperAdmin(role) ? (
                        <p className="inline-block px-2 py-1 bg-ulu-gold/20 text-ulu-gold rounded text-sm font-medium border border-ulu-gold/30">
                            {ROLE_LABELS[ROLES.SUPER_ADMIN]}
                        </p>
                    ) : isAdmin(role) ? (
                        <p className="inline-block px-2 py-1 bg-ulu-cyan/20 text-ulu-cyan rounded text-sm font-medium border border-ulu-cyan/30">
                            {ROLE_LABELS[ROLES.ADMIN]}
                        </p>
                    ) : (
                        <p className="inline-block px-2 py-1 bg-[#333] text-gray-300 rounded text-sm font-medium border border-[#444]">
                            {ROLE_LABELS[ROLES.MEMBER]}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
