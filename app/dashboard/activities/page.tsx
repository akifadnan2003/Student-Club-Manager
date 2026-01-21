import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { isAdmin } from "@/utils/roles";
import { getActivities } from "@/app/actions/activities";
import { CreateActivityDialog } from "./components/create-activity-dialog";
import { ActivitiesList } from "./components/activities-list";

export default async function ActivitiesPage() {
    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect('/login');

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

    const activities = await getActivities();

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Activities</h1>
                    <p className="text-sm text-ulu-text-secondary mt-1">
                        Manage club activities and events
                    </p>
                </div>
                {isAdmin(profile?.role) && <CreateActivityDialog />}
            </div>

            <ActivitiesList activities={activities} />
        </div>
    );
}
