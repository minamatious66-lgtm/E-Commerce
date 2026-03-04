"use client";
import React, { useEffect, useState } from "react";
import Hero from "@/components/Hero/Hero";
import { Product } from "@/Interfaces/productInterface";
import { Category } from "@/Interfaces/categoriesInterface";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ShoppingCart, Heart, Star, ChevronRight, ArrowRight } from "lucide-react";
import AddToCart from "@/components/AddToCart/AddToCart";
import WishlistButton from "@/components/WishlistButton/WishlistButton";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/products?limit=8`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`)
        ]);
        
        const prodData = await prodRes.json();
        const catData = await catRes.json();
        
        setProducts(prodData.data || []);
        setCategories(catData.data || []);
      } catch (error) {
        console.error("Failed to fetch home data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-16 pb-20">
      <Hero />

      {/* Categories Section */}
      <section className="container mx-auto px-4">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Shop by Category</h2>
            <p className="text-muted-foreground mt-2">Explore our wide range of categories</p>
          </div>
          <Link href="/categories">
            <Button variant="ghost" className="group">
              View All <ChevronRight className="ml-1 size-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-square bg-accent/20 animate-pulse rounded-full" />
            ))
          ) : (
            categories.slice(0, 6).map((category) => (
              <Link key={category._id} href={`/categories/${category._id}`} className="group text-center space-y-4">
                <div className="relative aspect-square overflow-hidden rounded-full border-4 border-transparent group-hover:border-primary transition-all duration-300 shadow-lg group-hover:shadow-primary/20">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <h3 className="font-bold text-lg group-hover:text-primary transition-colors">{category.name}</h3>
              </Link>
            ))
          )}
        </div>
      </section>

      {/* Featured Products */}
      <section className="container mx-auto px-4">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Featured Products</h2>
            <p className="text-muted-foreground mt-2">Our latest and most popular items</p>
          </div>
          <Link href="/products">
            <Button variant="ghost" className="group">
              View All <ChevronRight className="ml-1 size-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {loading ? (
             Array.from({ length: 8 }).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <div className="aspect-[4/5] bg-accent/20 animate-pulse" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-accent/20 animate-pulse w-3/4 rounded" />
                  <div className="h-4 bg-accent/20 animate-pulse w-1/2 rounded" />
                </div>
              </Card>
            ))
          ) : (
            products.map((product) => (
              <Card key={product._id} className="group overflow-hidden border-none shadow-hover transition-all duration-300 hover:-translate-y-2">
                <div className="relative aspect-[4/5] overflow-hidden bg-accent/10">
                  <Image
                    src={product.imageCover || ""}
                    alt={product.title || ""}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 z-10">
                    <WishlistButton productId={product.id || product._id || ""} />
                  </div>
                  {product.priceAfterDiscount && (
                    <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                      SALE
                    </div>
                  )}
                  <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-black/80 to-transparent">
                    <AddToCart productId={product.id || product._id || ""} />
                  </div>
                </div>
                <CardContent className="p-4 space-y-2">
                  <div className="flex justify-between items-start">
                    <p className="text-xs text-primary font-bold uppercase tracking-widest">{product.category?.name || "Category"}</p>
                    <div className="flex items-center gap-1 text-xs">
                       <Star className="size-3 fill-yellow-400 text-yellow-400" />
                       <span className="font-bold">{product.ratingsAverage}</span>
                    </div>
                  </div>
                  <Link href={`/products/${product.id || product._id}`}>
                    <h3 className="font-bold text-lg line-clamp-1 group-hover:text-primary transition-colors">
                      {product.title}
                    </h3>
                  </Link>
                  <p className="text-xs text-muted-foreground line-clamp-2 min-h-8">
                    {product.description}
                  </p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-bold text-primary">
                      {product.priceAfterDiscount ? product.priceAfterDiscount : product.price} EGP
                    </span>
                    {product.priceAfterDiscount && (
                       <span className="text-sm text-muted-foreground line-through opacity-50">{product.price} EGP</span>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </section>

      {/* Banner Section */}
      <section className="container mx-auto px-4">
        <Card className="bg-black text-white p-8 md:p-16 rounded-3xl overflow-hidden relative group">
          <div className="absolute top-0 right-0 w-1/2 h-full opacity-20 pointer-events-none group-hover:opacity-30 transition-opacity">
            <Image 
              src={products[0]?.imageCover || "https://res.cloudinary.com/postman/image/upload/v1/team/70e9560d859d20cd7786a6cb3d03ce9d8273bdf707ee639738f2822fa89d6583"} 
              alt="Promo" 
              fill 
              className="object-cover"
            />
          </div>
          <div className="relative z-10 max-w-xl space-y-6">
            <Badge variant="secondary" className="bg-white/10 text-white border-none py-1 px-4">Limited Offer</Badge>
            <h2 className="text-4xl md:text-6xl font-black leading-tight">Winter Collection 2026</h2>
            <p className="text-lg text-gray-400">Discover incredible deals on our latest winter collection. Get up to 50% discount on selected items.</p>
            <Link href="/products">
              <Button size="lg" className="bg-white text-black hover:bg-gray-200 mt-4 rounded-full px-8 py-6 group">
                Shop Now <ArrowRight className="ml-2 size-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </Card>
      </section>
    </div>
  );
}
