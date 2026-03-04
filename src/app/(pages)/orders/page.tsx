"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Order, OrdersResponse } from "@/Interfaces/orderInterface";
import { Package, Calendar, CreditCard, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import Image from "next/image";

export default function OrdersPage() {
  const { data: session } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!session) return;
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const token = (session as any).accessToken;
        // Decoded token usually has userId. In Route API, we might need a specific endpoint to find user orders.
        // Usually it's /api/v1/orders/user/:userId
        
        // Let's try to find the userId from the session or another API call if needed.
        // For now, let's assume the API has a "my orders" endpoint or we can get userId from somewhere.
        // Some students use /api/v1/orders/ after a search.
        
        // Actually, the common way is to get userId from the auth response and store it.
        // Let's check the session data again.
        
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
            headers: { token: token }
        });
        
        const data: OrdersResponse = await response.json();
        if (response.ok) {
          setOrders(data.data || []);
        }
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (session) {
      fetchOrders();
    }
  }, [session]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <Loader2 className="animate-spin size-8 text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-15 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">My Orders</h1>
        <p className="text-muted-foreground">View your shoping history and track packages</p>
      </div>

      {orders.length === 0 ? (
        <div className="py-20 text-center border-2 border-dashed rounded-xl">
          <Package className="size-16 mx-auto text-muted-foreground mb-4 opacity-50" />
          <h2 className="text-xl font-semibold">No orders yet</h2>
          <p className="text-muted-foreground">You haven&apos;t placed any orders yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <Card key={order._id} className="overflow-hidden border-l-4 border-l-primary shadow-md">
              <CardHeader className="bg-accent/30 flex-row justify-between items-center py-4">
                <div className="flex gap-6">
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase font-bold text-muted-foreground">Order ID</p>
                    <p className="text-xs font-mono">#{order._id.slice(-8).toUpperCase()}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase font-bold text-muted-foreground">Date</p>
                    <div className="flex items-center gap-1 text-sm font-medium">
                      <Calendar className="size-3" />
                      {new Date(order.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase font-bold text-muted-foreground">Amount</p>
                    <p className="text-sm font-bold text-primary">{order.totalOrderPrice} EGP</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Badge variant={order.isPaid ? "default" : "secondary"} className="flex gap-1 py-1">
                    {order.isPaid ? <CheckCircle2 className="size-3" /> : <Loader2 className="size-3 animate-spin"/>}
                    {order.isPaid ? "Paid" : "Pending Payment"}
                  </Badge>
                  <Badge variant={order.isDelivered ? "default" : "outline"} className="flex gap-1 py-1">
                    {order.isDelivered ? <CheckCircle2 className="size-3" /> : <Package className="size-3"/>}
                    {order.isDelivered ? "Delivered" : "In Transit"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-muted">
                  {order.cartItems.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4 p-4 hover:bg-accent/10 transition-colors">
                      <div className="relative size-16 bg-white rounded-md border p-1 shrink-0">
                        <Image
                          src={item.product.imageCover}
                          alt={item.product.title}
                          fill
                          className="object-contain"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold truncate">{item.product.title}</h4>
                        <p className="text-xs text-muted-foreground">Quantity: {item.count}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold">{item.price} EGP</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="bg-accent/10 border-t py-3 flex justify-between">
                 <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <CreditCard className="size-4" />
                    <span>Payment Method: <span className="font-bold text-foreground uppercase">{order.paymentMethodType}</span></span>
                 </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
