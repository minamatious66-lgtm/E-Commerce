"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Product } from "@/Interfaces/productInterface";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Trash2, ShoppingCart, Star, Loader2, Heart } from "lucide-react";
import toast from "react-hot-toast";
import AddToCart from "@/components/AddToCart/AddToCart";
import { Badge } from "@/components/ui/badge";

export default function WishlistPage() {
  const { data: session } = useSession();
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRemoving, setIsRemoving] = useState<string | null>(null);

  const fetchWishlist = async () => {
    if (!session) return;
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const token = (session as any).accessToken;
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/wishlist`, {
        headers: { token: token },
      });
      const data = await response.json();
      if (response.ok) {
        setWishlist(data.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch wishlist:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session) {
      fetchWishlist();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  const removeFromWishlist = async (productId: string) => {
    setIsRemoving(productId);
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const token = (session as any).accessToken;
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/wishlist/${productId}`, {
        method: "DELETE",
        headers: { token: token },
      });

      if (response.ok) {
        toast.success("Removed from wishlist");
        setWishlist(wishlist.filter((p) => (p.id || p._id) !== productId));
      } else {
        toast.error("Failed to remove item");
      }
    } catch {
      toast.error("An error occurred");
    } finally {
      setIsRemoving(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin size-12 text-primary" />
      </div>
    );
  }

  if (wishlist.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center space-y-6">
        <Heart className="size-20 mx-auto text-muted-foreground opacity-20" />
        <h1 className="text-3xl font-bold">Your Wishlist is Empty</h1>
        <p className="text-muted-foreground">Save items you like to your wishlist to buy them later.</p>
        <Link href="/products">
          <Button size="lg" className="rounded-full px-8">Browse Products</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-18 space-y-8">
      <div>
        <h1 className="text-4xl font-bold">My Wishlist</h1>
        <p className="text-muted-foreground mt-2">{wishlist.length} items saved to your list</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {wishlist.map((product) => (
          <Card key={product.id || product._id} className="group overflow-hidden border-none shadow-hover transition-all duration-300 hover:-translate-y-1">
            <div className="relative aspect-[4/5] bg-accent/10 overflow-hidden">
              <Image
                src={product.imageCover || ""}
                alt={product.title || ""}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <button
                onClick={() => removeFromWishlist(product.id || product._id || "")}
                disabled={isRemoving === (product.id || product._id || "")}
                className="absolute top-4 right-4 z-10 p-2 bg-white/80 backdrop-blur rounded-full text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-md cursor-pointer"
              >
                {isRemoving === (product.id || product._id) ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
              </button>
            </div>
            <CardContent className="p-4 space-y-3">
              <p className="text-xs text-primary font-bold uppercase tracking-wider">{product.category?.name || "Category"}</p>
              <Link href={`/products/${product.id || product._id}`}>
                <h3 className="font-bold text-lg line-clamp-1 group-hover:text-primary transition-colors">{product.title}</h3>
              </Link>
              <div className="flex justify-between items-center">
                <span className="text-xl font-black text-primary">
                  {product.priceAfterDiscount ? product.priceAfterDiscount : product.price} EGP
                </span>
                <div className="flex items-center gap-1 text-sm bg-accent/50 px-2 py-0.5 rounded">
                  <Star className="size-3 fill-yellow-400 text-yellow-400" />
                  <span className="font-bold">{product.ratingsAverage}</span>
                </div>
              </div>
              <div className="pt-2">
                 <AddToCart productId={product.id || product._id || ""} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
