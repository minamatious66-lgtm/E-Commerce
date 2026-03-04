"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Address, AddressResponse } from "@/Interfaces/addressInterface";
import { CartRes } from "@/Interfaces/CartInterface";
import { MapPin, CreditCard, Banknote, Loader2, ArrowRight, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CheckoutPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "online">("cash");
  const [cart, setCart] = useState<CartRes | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!session) return;
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const token = (session as any).accessToken;
        
        // Fetch Addresses
        const addrRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/addresses`, {
          headers: { token: token },
        });
        const addrData: AddressResponse = await addrRes.json();
        if (addrRes.ok) {
          setAddresses(addrData.data || []);
          if (addrData.data?.length > 0) {
            setSelectedAddressId(addrData.data[0]._id);
          }
        }

        // Fetch Cart
        const cartRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart`, {
          headers: { token: token },
        });
        const cartData: CartRes = await cartRes.json();
        if (cartRes.ok) {
          setCart(cartData);
        }
      } catch (error) {
        console.error("Failed to fetch checkout data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (session) {
      fetchData();
    }
  }, [session]);

  const handleCheckout = async () => {
    if (!session || !cart || !selectedAddressId) {
      toast.error("Please select an address");
      return;
    }

    const selectedAddress = addresses.find(a => a._id === selectedAddressId);
    if (!selectedAddress) return;

    setIsProcessing(true);
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const token = (session as any).accessToken;
      const cartId = cart.cartId;

      if (paymentMethod === "cash") {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${cartId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            token: token,
          },
          body: JSON.stringify({
            shippingAddress: {
              details: selectedAddress.details,
              phone: selectedAddress.phone,
              city: selectedAddress.city,
            },
          }),
        });

        if (response.ok) {
          toast.success("Order placed successfully!");
          router.push("/orders");
        } else {
          toast.error("Failed to place order");
        }
      } else {
        // Online Payment
        const baseUrl = window.location.origin;
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/checkout-session/${cartId}?url=${baseUrl}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            token: token,
          },
          body: JSON.stringify({
            shippingAddress: {
              details: selectedAddress.details,
              phone: selectedAddress.phone,
              city: selectedAddress.city,
            },
          }),
        });

        const resData = await response.json();
        if (response.ok && resData.session?.url) {
          window.location.href = resData.session.url;
        } else {
          toast.error("Failed to initiate online payment");
        }
      }
    } catch {
      toast.error("An error occurred during checkout");
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin size-12 text-primary" />
      </div>
    );
  }

  if (!cart || cart.numOfCartItems === 0) {
    return (
      <div className="text-center py-20 space-y-4">
        <h1 className="text-3xl font-bold">Your Cart is Empty</h1>
        <Link href="/products">
          <Button>Back to Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 lg:px-8 py-20">
      <h1 className="text-4xl font-bold mb-8">Checkout</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Address Selection */}
          <section>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <MapPin className="size-5 text-primary" /> Shipping Address
              </h2>
              <Link href="/addresses">
                <Button variant="outline" size="sm">Manage Addresses</Button>
              </Link>
            </div>
            
            {addresses.length === 0 ? (
              <Card className="border-dashed border-2">
                <CardContent className="p-6 text-center">
                  <p className="text-muted-foreground mb-4">No addresses found.</p>
                  <Link href="/addresses">
                    <Button>Add New Address</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {addresses.map((address) => (
                  <Card 
                    key={address._id}
                    className={`cursor-pointer transition-all border-2 ${selectedAddressId === address._id ? 'border-primary bg-primary/5' : 'border-transparent'}`}
                    onClick={() => setSelectedAddressId(address._id)}
                  >
                    <CardContent className="p-4 relative">
                      {selectedAddressId === address._id && (
                        <CheckCircle2 className="absolute top-2 right-2 size-5 text-primary" />
                      )}
                      <p className="font-bold">{address.name}</p>
                      <p className="text-sm text-muted-foreground">{address.details}</p>
                      <p className="text-sm text-muted-foreground">{address.city}</p>
                      <p className="text-sm text-muted-foreground">{address.phone}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </section>

          {/* Payment Method */}
          <section>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
               <CreditCard className="size-5 text-primary" /> Payment Method
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card 
                className={`cursor-pointer transition-all border-2 ${paymentMethod === 'cash' ? 'border-primary bg-primary/5' : 'border-transparent'}`}
                onClick={() => setPaymentMethod('cash')}
              >
                <CardContent className="p-6 flex items-center gap-4">
                  <div className={`p-3 rounded-full ${paymentMethod === 'cash' ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'}`}>
                    <Banknote className="size-6" />
                  </div>
                  <div>
                    <p className="font-bold">Cash on Delivery</p>
                    <p className="text-sm text-muted-foreground">Pay when your order arrives</p>
                  </div>
                </CardContent>
              </Card>

              <Card 
                className={`cursor-pointer transition-all border-2 ${paymentMethod === 'online' ? 'border-primary bg-primary/5' : 'border-transparent'}`}
                onClick={() => setPaymentMethod('online')}
              >
                <CardContent className="p-6 flex items-center gap-4 relative">
                   {paymentMethod === 'online' && <CheckCircle2 className="absolute top-2 right-2 size-4 text-primary" />}
                  <div className={`p-3 rounded-full ${paymentMethod === 'online' ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'}`}>
                    <CreditCard className="size-6" />
                  </div>
                  <div>
                    <p className="font-bold">Online Payment</p>
                    <p className="text-sm text-muted-foreground">Credit Card / Debit Card (Stripe)</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24 shadow-lg overflow-hidden">
            <CardHeader className="bg-primary text-white">
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                {cart.data?.products.map((item) => (
                  <div key={item._id} className="flex justify-between text-sm">
                    <span className="truncate max-w-[150px]">{item.product.title}</span>
                    <span className="text-muted-foreground">x{item.count}</span>
                    <span className="font-semibold">{item.price * item.count} EGP</span>
                  </div>
                ))}
              </div>
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>{cart.data?.totalCartPrice} EGP</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span className="text-green-600 font-bold">FREE</span>
                </div>
                <div className="flex justify-between font-bold text-xl border-t pt-2">
                  <span>Total</span>
                  <span className="text-primary">{cart.data?.totalCartPrice} EGP</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="p-6 bg-accent/30">
              <Button 
                className="w-full text-lg py-6 shadow-lg shadow-primary/20" 
                onClick={handleCheckout} 
                disabled={isProcessing || addresses.length === 0}
              >
                {isProcessing ? (
                  <Loader2 className="animate-spin size-5 mr-2" />
                ) : (
                  <>
                    {paymentMethod === 'cash' ? "Place Order" : "Go to Payment"}
                    <ArrowRight className="ml-2 size-5" />
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
