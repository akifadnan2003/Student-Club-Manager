import { Sidebar } from "@/components/layout/Sidebar";
import { MobileNav } from "@/components/layout/MobileNav";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', user.id)
        .single();

    return (
        <div className="min-h-screen bg-ulu-bg flex flex-col md:flex-row">
            {/* Mobile Nav */}
            <MobileNav fullName={profile?.full_name} />

            {/* Desktop Sidebar */}
            <Sidebar fullName={profile?.full_name} />

            {/* Main Content Area */}
            <main className="flex-1 pt-0 md:pl-64 min-h-screen transition-all duration-300 flex flex-col">

                {/* Desktop Header for branding */}
                <header className="hidden md:flex items-center justify-end px-8 py-4 bg-ulu-bg/50 backdrop-blur-sm sticky top-0 z-10">
                    <div className="flex items-center gap-3">
                        <span className="text-white font-semibold tracking-wide text-sm opacity-90 font-mono">ISC ADMIN PANEL</span>
                        <div className="h-12 w-12 rounded-full overflow-hidden border-2 border-ulu-gold/50 shadow-lg shadow-ulu-blue/20 bg-white flex items-center justify-center">
                            <img
                                src="/isc-logo.jpg"
                                alt="ISC Logo"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                </header>

                <div className="container mx-auto p-4 md:p-8 max-w-7xl flex-1 mt-16 md:mt-0">
                    {children}
                </div>
            </main>
        </div>
    );
}
