"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState, useCallback } from "react";
import { CartRes } from "@/Interfaces/CartInterface";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Cart() {
  const { data: session } = useSession();
  const router = useRouter();
  const [cart, setCart] = useState<CartRes | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchCart = useCallback(async () => {
    if (!session) return;
    
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const token = (session as any).accessToken;
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/cart`,
        {
          headers: {
            token: token,
          },
        }
      );

      const data: CartRes = await response.json();
      setCart(data);
    } catch {
      toast.error("Failed to load cart");
    } finally {
      setLoading(false);
    }
  }, [session]);

  useEffect(() => {
    if (!session) {
      router.push("/login");
      return;
    }
    fetchCart();
  }, [session, router, fetchCart]);

  const removeFromCart = async (productId: string) => {
    if (!session) return;

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const token = (session as any).accessToken;
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/cart/${productId}`,
        {
          method: "DELETE",
          headers: {
            token: token,
          },
        }
      );
      toast.success("Item removed from cart");
      fetchCart();
    } catch {
      toast.error("Failed to remove item");
    }
  };

  const updateQuantity = async (productId: string, count: number) => {
    if (!session || count < 1) return;

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const token = (session as any).accessToken;
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/cart/${productId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            token: token,
          },
          body: JSON.stringify({ count }),
        }
      );
      fetchCart();
    } catch {
      toast.error("Failed to update quantity");
    }
  };

  const clearCart = async () => {
    if (!session) return;

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const token = (session as any).accessToken;
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/cart`,
        {
          method: "DELETE",
          headers: {
            token: token,
          },
        }
      );

      if (response.ok) {
        toast.success("Cart cleared successfully");
        setCart(null);
        fetchCart();
      } else {
        toast.error("Failed to clear cart");
      }
    } catch {
      toast.error("An error occurred");
    }
  };

  if (loading) {
    return <div className="text-center py-10">Loading cart...</div>;
  }

  if (!cart || !cart.data || cart.numOfCartItems === 0) {
    return (
      <div className="text-center py-10 space-y-4">
        <h1 className="text-3xl font-bold">Your Cart is Empty</h1>
        <p className="text-muted-foreground">Add some products to get started!</p>
        <Link href="/products">
          <Button>Browse Products</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 py-20">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Shopping Cart</h1>
        <Button 
          variant="outline" 
          size="sm" 
          className="text-destructive hover:bg-destructive shadow-none hover:text-white border-destructive"
          onClick={clearCart}
        >
          <Trash2 className="size-4 mr-2" /> Clear Cart
        </Button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {cart.data.products.map((item) => (
            <Card key={item._id}>
              <CardContent className="p-4 flex gap-4">
                <div className="relative w-24 h-24">
                  <Image
                    src={item.product.imageCover}
                    alt={item.product.title}
                    fill
                    className="object-cover rounded"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{item.product.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {item.product.brand?.name}
                  </p>
                  <p className="font-bold mt-2">{item.price} EGP</p>
                </div>
                <div className="flex flex-col items-end justify-between">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFromCart(item.product._id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateQuantity(item.product._id, item.count - 1)}
                      disabled={item.count <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-8 text-center">{item.count}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateQuantity(item.product._id, item.count + 1)}
                      >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Items ({cart.numOfCartItems})</span>
                <span>{cart.data.totalCartPrice} EGP</span>
              </div>
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>{cart.data.totalCartPrice} EGP</span>
              </div>
              <Link href="/products" className="block pb-2">
                <Button variant="outline" className="w-full">Continue Shopping</Button>
              </Link>
              <Link href="/checkout">
                <Button className="w-full">Proceed to Checkout</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
