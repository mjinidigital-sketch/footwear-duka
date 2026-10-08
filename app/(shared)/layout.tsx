import EcommerceFooterWithPayments from "@/components/blocks/ecommerce/ecommerce-footers/with-payments";
import Navbar1 from "@/components/navbar1";

export default function SharedLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar1 />
            <main className="flex-grow">{children}</main>
            <EcommerceFooterWithPayments />
        </div>
    );
}