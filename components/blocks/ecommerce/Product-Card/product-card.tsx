import { startTransition, useState, useCallback, useMemo, memo } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, ShoppingCart, Star, X, Check } from 'lucide-react';
import productSchema, { ProductSchema } from '@/app/schemas/product';
import { useCart } from '@/contexts/CartContext';


// Memoized product card component to prevent unnecessary re-renders
const ProductCard = memo(({ product }: { product: ProductSchema }) => {
    const { addToCart } = useCart();
    const [isAdding, setIsAdding] = useState(false);
    const [added, setAdded] = useState(false);

    const handleAddToCart = async () => {
        setIsAdding(true);
        try {
            await addToCart({
                productId: product._id,
                quantity: 1,
                color: product.colors?.[0]?.name || 'Default',
                size: product.sizes?.[0] || 40,
                price: product.price,
                originalPrice: product.compareAtPrice,
            });
            setAdded(true);
            setTimeout(() => setAdded(false), 2000);
        } catch (error) {
            console.error('Error adding to cart:', error);
        } finally {
            setIsAdding(false);
        }
    };

    const formatPrice = (price: number) => `KES ${price.toLocaleString()}`;

    return (
        <div className="group overflow-hidden rounded-lg border">
            <div className="relative aspect-square overflow-hidden bg-gray-100">
                <img
                    src={product.mainImage}
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
                <Button
                    size="icon"
                    variant="ghost"
                    className="absolute top-2 right-2 h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm"
                >
                    <Heart className="h-4 w-4" />
                </Button>
            </div>
            <div className="p-4">
                <div className="flex justify-between">
                    <div>
                        <h3 className="font-medium">{product.name}</h3>
                        <p className="text-muted-foreground text-sm">{product.categorySlug}</p>
                    </div>
                    <div className="text-right">
                        {/* <div className="flex items-center gap-1">
                            <Star className="fill-primary text-primary h-4 w-4" />
                            <span className="text-sm font-medium">{product.rating}</span>
                        </div>
                        {/* <p className="text-muted-foreground text-xs">
                            {product.reviews} reviews
                        </p> */}
                    </div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="font-medium">{formatPrice(product.price)}</span>
                        {product.compareAtPrice && (
                            <span className="text-muted-foreground text-sm line-through">
                                {formatPrice(product.compareAtPrice)}
                            </span>
                        )}
                    </div>
                    <Button 
                        size="sm" 
                        className="h-8"
                        onClick={handleAddToCart}
                        disabled={isAdding || added}
                    >
                        {isAdding ? (
                            'Adding...'
                        ) : added ? (
                            <>
                                <Check className="mr-2 h-4 w-4" />
                                Added
                            </>
                        ) : (
                            <>
                                <ShoppingCart className="mr-2 h-4 w-4" />
                                Add
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
});


export default ProductCard;