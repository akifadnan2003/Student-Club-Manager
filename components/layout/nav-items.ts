import { LayoutDashboard, Users, CheckSquare, Calendar, MessageSquare } from "lucide-react";

export const NAV_ITEMS = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Members", href: "/dashboard/members", icon: Users },
    { label: "Tasks", href: "/dashboard/tasks", icon: CheckSquare },
    { label: "Activities", href: "/dashboard/activities", icon: Calendar },
    { label: "Speaking Club", href: "/dashboard/speaking-club", icon: MessageSquare },
];
