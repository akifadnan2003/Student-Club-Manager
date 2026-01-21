'use client'

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/utils/cn";
import { NAV_ITEMS } from "./nav-items";
import { Menu, X, LogOut } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

export function MobileNav({ fullName }: { fullName?: string | null }) {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const supabase = createClient();

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        setIsOpen(false);
        router.refresh();
        router.push('/login');
    };

    return (
        <div className="md:hidden flex h-16 w-full items-center justify-between px-4 border-b border-[#333] bg-ulu-surface fixed top-0 left-0 z-50">
            <span className="text-xl font-bold text-white">ISC Admin</span>

            <button
                onClick={() => setIsOpen(true)}
                className="p-2 -mr-2 text-white hover:text-ulu-blue min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
                <Menu className="h-6 w-6" />
            </button>

            {/* Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/80 z-50 backdrop-blur-sm"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Drawer */}
            <div className={cn(
                "fixed inset-y-0 left-0 z-50 w-64 bg-ulu-surface border-r border-[#333] shadow-xl transform transition-transform duration-300 ease-in-out flex flex-col",
                isOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="flex flex-col h-20 justify-center px-6 border-b border-[#333]">
                    <span className="text-xl font-bold text-white">Menu</span>
                    {fullName && (
                        <span className="text-xs text-ulu-text-secondary truncate" title={fullName}>
                            {fullName}
                        </span>
                    )}
                    <button
                        onClick={() => setIsOpen(false)}
                        className="p-2 -mr-2 text-gray-400 hover:text-white"
                    >
                        <X className="h-5 w-5" />
                    </button>
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
                                    onClick={() => setIsOpen(false)}
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
            </div>
        </div>
    );
}
