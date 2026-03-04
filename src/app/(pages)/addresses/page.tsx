"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Address, AddressResponse, SingleAddressResponse } from "@/Interfaces/addressInterface";
import { MapPin, Plus, Trash2, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const addressSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  details: z.string().min(1, { message: "Details are required" }),
  phone: z.string().min(10, { message: "Phone must be at least 10 characters" }),
  city: z.string().min(1, { message: "City is required" }),
});

type AddressFormValues = z.infer<typeof addressSchema>;

export default function AddressesPage() {
  const { data: session } = useSession();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      name: "",
      details: "",
      phone: "",
      city: "",
    },
  });

  const fetchAddresses = async () => {
    if (!session) return;
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const token = (session as any).accessToken;
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/addresses`, {
        headers: { token: token },
      });
      const data: AddressResponse = await response.json();
      if (response.ok) {
        setAddresses(data.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch addresses:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  const onAddAddress = async (data: AddressFormValues) => {
    setIsAdding(true);
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const token = (session as any).accessToken;
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/addresses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: token,
        },
        body: JSON.stringify(data),
      });

      const resData: SingleAddressResponse = await response.json();
      if (response.ok) {
        toast.success("Address added successfully!");
        setIsOpen(false);
        form.reset();
        fetchAddresses();
      } else {
        toast.error(resData.message || "Failed to add address");
      }
    } catch {
      toast.error("An error occurred");
    } finally {
      setIsAdding(false);
    }
  };

  const onDeleteAddress = async (addressId: string) => {
    setIsDeleting(addressId);
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const token = (session as any).accessToken;
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/addresses/${addressId}`, {
        method: "DELETE",
        headers: { token: token },
      });

      if (response.ok) {
        toast.success("Address deleted successfully!");
        setAddresses(addresses.filter((a) => a._id !== addressId));
      } else {
        toast.error("Failed to delete address");
      }
    } catch {
      toast.error("An error occurred");
    } finally {
      setIsDeleting(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <Loader2 className="animate-spin size-8 text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6 py-20">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">My Addresses</h1>
          <p className="text-muted-foreground">Manage your shipping information</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="flex gap-2">
              <Plus className="size-4" /> Add New Address
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Address</DialogTitle>
              <DialogDescription>
                Enter your shipping address details.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onAddAddress)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location Name (e.g. Home, Office)</FormLabel>
                      <FormControl>
                        <Input placeholder="Home" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="details"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Street Details</FormLabel>
                      <FormControl>
                        <Input placeholder="123 Street Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input placeholder="Cairo" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <Input placeholder="010..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isAdding}>
                  {isAdding ? "Adding..." : "Add Address"}
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {addresses.length === 0 ? (
          <div className="col-span-full py-12 text-center border-2 border-dashed rounded-lg">
            <MapPin className="size-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-lg font-medium">No addresses found</p>
            <p className="text-muted-foreground">Add a shipping address to use during checkout.</p>
          </div>
        ) : (
          addresses.map((address) => (
            <Card key={address._id} className="relative group overflow-hidden">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <MapPin className="size-5 text-primary" />
                    <CardTitle className="text-lg">{address.name}</CardTitle>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:bg-destructive/10 -mt-2 -mr-2"
                    onClick={() => onDeleteAddress(address._id)}
                    disabled={isDeleting === address._id}
                  >
                    {isDeleting === address._id ? (
                      <Loader2 className="animate-spin size-4" />
                    ) : (
                      <Trash2 className="size-4" />
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="text-sm space-y-1">
                <p className="font-medium">{address.details}</p>
                <p className="text-muted-foreground">{address.city}</p>
                <p className="text-muted-foreground">{address.phone}</p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
