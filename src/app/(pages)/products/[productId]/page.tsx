

import AddToCart from "@/components/AddToCart/AddToCart";
import Slider from "@/components/Slider/Slider";
import WishlistButton from "@/components/WishlistButton/WishlistButton";
import { Product } from "@/Interfaces/productInterface";
import { Star } from "lucide-react";

export default async function ProductDetails({
  params,
}: {
  params: { productId: string };
}) {
  const productId = params.productId;

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/products/${productId}`,
    { cache: "no-store" }
  );

  if (!response.ok) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        Product Not Found
      </div>
    );
  }

  const result = await response.json();
  const product: Product = result.data;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-20">

        <div className="grid lg:grid-cols-2 gap-16 items-center">

          
          <div className="rounded-3xl overflow-hidden bg-card border shadow-2xl">
            <Slider
              image={product?.images ?? []}
              title={product?.title ?? ""}
            />
          </div>

         
          <div className="space-y-10">

            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-5xl font-extrabold tracking-tight leading-tight">
                  {product?.title}
                </h1>

                <div className="flex items-center gap-3 mt-4 text-muted-foreground">
                  <div className="flex items-center gap-1 text-yellow-400">
                    <Star className="size-4 fill-yellow-400" />
                    {product?.ratingsAverage ?? 0}
                  </div>
                  <span className="w-1 h-1 bg-muted-foreground rounded-full"></span>
                  <span>{product?.brand?.name}</span>
                </div>
              </div>

              <WishlistButton
                productId={product?.id ?? product?._id ?? ""}
              />
            </div>

           
            <div className="flex items-center gap-6">
              <span className="text-5xl font-black text-primary">
                {product?.priceAfterDiscount ?? product?.price} EGP
              </span>

              {product?.priceAfterDiscount && (
                <span className="text-xl line-through text-muted-foreground">
                  {product?.price} EGP
                </span>
              )}
            </div>

            
            <p className="text-lg text-muted-foreground leading-relaxed max-w-xl">
              {product?.description}
            </p>

            
            <div className="pt-6">
              <AddToCart productId={product?.id ?? product?._id ?? ""} />
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}