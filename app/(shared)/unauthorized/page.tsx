import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function UnauthorizedPage() {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <Card className="p-10 mx-auto max-w-md">
                <CardContent className="flex flex-col items-center justify-center space-y-4">
                    <h1 className="text-4xl font-bold">Access Denied</h1>
                    <p>You do not have permission to view this page.</p>
                    <Button variant="default" className="px-8 py-6 mt-4">

                        <Link href="/">
                            Go back home
                        </Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}