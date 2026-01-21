'use client'

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/utils/cn";
import { NAV_ITEMS } from "./nav-items";
import { LogOut } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export function Sidebar({ fullName }: { fullName?: string | null }) {
    const pathname = usePathname();
    const router = useRouter();
    const supabase = createClient();

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.refresh();
        router.push('/login');
    };

    return (
        <aside className="hidden md:flex h-screen w-64 flex-col fixed left-0 top-0 border-r border-[#333] bg-ulu-surface text-ulu-text-primary z-50">
            <div className="flex flex-col h-20 justify-center px-6 border-b border-[#333]">
                <span className="text-xl font-bold text-white">ISC Admin</span>
                {fullName && (
                    <span className="text-xs text-ulu-text-secondary truncate" title={fullName}>
                        {fullName}
                    </span>
                )}
            </div>

            <div className="flex-1 overflow-y-auto py-4">
                <nav className="grid gap-1 px-2">
                    {NAV_ITEMS.map((item, index) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;

                        return (
                            <Link
                                key={index}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors min-h-[44px]",
                                    isActive
                                        ? "bg-ulu-blue text-white"
                                        : "text-ulu-text-secondary hover:bg-[#333] hover:text-white"
                                )}
                            >
                                <Icon className="h-5 w-5" />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            <div className="p-4 border-t border-[#333]">
                <button
                    onClick={handleSignOut}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-ulu-red hover:bg-[#330000] transition-colors min-h-[44px]"
                >
                    <LogOut className="h-5 w-5" />
                    Sign Out
                </button>
            </div>
        </aside>
    );
}
