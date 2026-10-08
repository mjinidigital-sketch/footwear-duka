import {
    isAuthenticatedNextjs,
    convexAuthNextjsToken,
} from "@convex-dev/auth/nextjs/server";
import { fetchQuery } from "convex/nextjs"; // ✅ import from convex/nextjs
import { api } from "@/convex/_generated/api";
import { redirect } from "next/navigation";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const authenticated = await isAuthenticatedNextjs();
    if (!authenticated) {
        redirect("/login");
    }

    const user = await fetchQuery(
        api.users.viewer,
        {},
        { token: await convexAuthNextjsToken() },
    );

    if (!user || user.role !== "admin") {
        redirect("/unauthorized");
    }

    const userData = {
        name: user.name || "Admin",
        email: user.email || "admin@footwearduka.com",
        avatar: user.image || "/avatars/default.jpg",
    };

    return (
        <SidebarProvider
            style={
                {
                    "--sidebar-width": "calc(var(--spacing) * 72)",
                    "--header-height": "calc(var(--spacing) * 12)",
                } as React.CSSProperties
            }
        >
            <AppSidebar variant="inset" user={userData} />
            <SidebarInset>
                <SiteHeader />
                {children}
            </SidebarInset>
        </SidebarProvider>
    );
}