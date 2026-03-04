import { ProductResponse } from '@/Interfaces/productInterface';
import AddToCart from '@/components/AddToCart/AddToCart';
import WishlistButton from '@/components/WishlistButton/WishlistButton';
import { Card, CardContent } from "@/components/ui/card";
import { Star, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default async function Products() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, { cache: 'no-store' });
  if (!res.ok) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold">Failed to load products.</h2>
      </div>
    );
  }

  const data: ProductResponse = await res.json();
  const products = data.data || [];

  return (
    <div className="container mx-auto px-4 py-12">
     
      <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tight">All Products</h1>
          <p className="text-muted-foreground mt-2 font-medium">
            Showing {products.length} premium items
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight className="size-4" />
          <span className="text-foreground">Products</span>
        </div>
      </div>

      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {products.map((product) => (
          <Card
            key={product.id || product._id}
            className="group overflow-hidden border-none shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 rounded-2xl"
          >
            <div className="relative aspect-[4/5] overflow-hidden rounded-t-2xl bg-accent/10">
              <Image
                src={product.imageCover || ''}
                alt={product.title || ''}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-4 right-4 z-10">
                <WishlistButton productId={product.id || product._id || ''} />
              </div>
              {product.priceAfterDiscount && (
                <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded shadow-lg animate-pulse">
                  SALE
                </div>
              )}
              <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-black/80 to-transparent">
                <AddToCart productId={product.id || product._id || ''} />
              </div>
            </div>

            <CardContent className="p-4 space-y-2">
              <div className="flex justify-between items-center">
                <p className="text-[10px] text-yellow-400 font-black uppercase tracking-widest">
                  {product.category?.name}
                </p>
                <div className="flex items-center gap-1 text-xs">
                  <Star className="size-3 fill-yellow-400 text-yellow-400 drop-shadow" />
                  <span className="font-bold">{product.ratingsAverage}</span>
                </div>
              </div>

              <Link href={`/products/${product.id || product._id}`}>
                <h3 className="font-bold text-lg line-clamp-1 group-hover:text-yellow-400 transition-colors leading-tight">
                  {product.title}
                </h3>
              </Link>

              <p className="text-xs text-muted-foreground line-clamp-2 min-h-8">
                {product.description}
              </p>

              <div className="flex items-baseline gap-2 pt-1">
                <span className="text-xl font-black text-yellow-400">
                  {product.priceAfterDiscount || product.price} EGP
                </span>
                {product.priceAfterDiscount && (
                  <span className="text-sm text-muted-foreground line-through opacity-50">
                    {product.price} EGP
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}