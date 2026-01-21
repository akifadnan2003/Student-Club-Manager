import { createClient } from "@/utils/supabase/server";
import { MembersList } from "./components/members-list";
import { AddMemberDialog } from "./components/add-member-dialog";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic';

import { isSuperAdmin } from "@/utils/roles";

export default async function MembersPage() {
    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    // Get current user role
    const { data: currentUserProfile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

    const isCurrentSuperAdmin = isSuperAdmin(currentUserProfile?.role);

    // Fetch all members
    const { data: members, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        return <div className="text-red-500">Error loading members</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Members Directory</h1>
                    <p className="text-ulu-text-secondary text-sm mt-1">Manage all club members and their roles</p>
                </div>
                {isCurrentSuperAdmin && <AddMemberDialog />}
            </div>

            <MembersList members={members || []} currentUserRole={currentUserProfile?.role} />
        </div>
    );
}
