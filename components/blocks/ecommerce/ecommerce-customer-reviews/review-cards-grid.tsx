import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, ShieldCheck, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function ReviewCardsGrid() {
  const reviews = [
    {
      id: 1,
      name: "Emily Chen",
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop&ixlib=rb-4.0.3",
      rating: 5,
      review:
        "Absolutely love my purchase! The quality is outstanding and it arrived faster than expected. Will definitely order again.",
      product: "Wireless Headphones",
      verified: true,
      date: "2 days ago",
    },
    {
      id: 2,
      name: "Michael Rodriguez",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop&ixlib=rb-4.0.3",
      rating: 5,
      review:
        "Great customer service and the product exceeded my expectations. The packaging was also very professional.",
      product: "Smartphone Case",
      verified: true,
      date: "1 week ago",
    },
    {
      id: 3,
      name: "Sarah Williams",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=400&auto=format&fit=crop&ixlib=rb-4.0.3",
      rating: 4,
      review:
        "Really satisfied with this purchase. Good value for money and the delivery was on time. Highly recommend!",
      product: "Laptop Stand",
      verified: true,
      date: "2 weeks ago",
    },
    {
      id: 4,
      name: "David Thompson",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400&auto=format&fit=crop&ixlib=rb-4.0.3",
      rating: 5,
      review:
        "Excellent product quality and fast shipping. The item was exactly as described and works perfectly.",
      product: "Bluetooth Speaker",
      verified: true,
      date: "3 weeks ago",
    },
    {
      id: 5,
      name: "Jessica Park",
      avatar:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&auto=format&fit=crop&ixlib=rb-4.0.3",
      rating: 5,
      review:
        "Amazing experience! The product is high quality and the customer support team was very helpful with my questions.",
      product: "Wireless Charger",
      verified: true,
      date: "1 month ago",
    },
    {
      id: 6,
      name: "Robert Kim",
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop&ixlib=rb-4.0.3",
      rating: 4,
      review:
        "Very happy with my purchase. The build quality is solid and it does exactly what I needed it to do.",
      product: "USB Hub",
      verified: true,
      date: "1 month ago",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-24 md:px-6 lg:py-32 2xl:max-w-[1400px]">
      <div className="mb-16 text-center">
        <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
          Customer Reviews
        </h2>
        <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
          See what our customers are saying about their shopping experience
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {reviews.map((review) => (
          <Card key={review.id} className="h-full gap-3">
            <CardHeader>
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarImage
                    width={48}
                    height={48}
                    src={review.avatar}
                    className="object-cover"
                  />
                  <AvatarFallback>
                    <User className="size-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    <h3 className="text-sm font-semibold">{review.name}</h3>
                    {review.verified && (
                      <Badge variant="secondary" className="text-xs">
                        <ShieldCheck className="mr-1 size-3" />
                        Verified
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`size-4 ${
                            i < review.rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-muted-foreground"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-muted-foreground text-xs">
                      {review.date}
                    </span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col">
              <p className="mb-3 flex-1 text-sm leading-relaxed">
                {review.review}
              </p>
              <p className="text-muted-foreground text-xs font-medium">
                Product: {review.product}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
