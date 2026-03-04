"use client";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { User, MapPin, Package, Lock } from "lucide-react";

export default function ProfilePage() {
  const { data: session } = useSession();

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <h1 className="text-2xl font-bold">You are not logged in</h1>
        <Link href="/login">
          <Button>Go to Login</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 space-y-8 py-20">
      <div className="flex items-center gap-4 mb-8">
        <div className="size-16 rounded-full bg-primary flex items-center justify-center text-white text-2xl font-bold">
          {session.user?.name?.[0].toUpperCase() || "U"}
        </div>
        <div>
          <h1 className="text-3xl font-bold">{session.user?.name}</h1>
          <p className="text-muted-foreground">{session.user?.email}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/addresses">
          <Card className="hover:border-primary transition-colors cursor-pointer group">
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                <MapPin className="size-6" />
              </div>
              <div>
                <CardTitle>My Addresses</CardTitle>
                <CardDescription>Manage your delivery addresses</CardDescription>
              </div>
            </CardHeader>
          </Card>
        </Link>

        <Link href="/orders">
          <Card className="hover:border-primary transition-colors cursor-pointer group">
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                <Package className="size-6" />
              </div>
              <div>
                <CardTitle>My Orders</CardTitle>
                <CardDescription>View your order history and status</CardDescription>
              </div>
            </CardHeader>
          </Card>
        </Link>

        <Link href="/change-password">
          <Card className="hover:border-primary transition-colors cursor-pointer group">
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                <Lock className="size-6" />
              </div>
              <div>
                <CardTitle>Security</CardTitle>
                <CardDescription>Update your password and security settings</CardDescription>
              </div>
            </CardHeader>
          </Card>
        </Link>

        <Card className="hover:border-primary transition-colors cursor-pointer group">
          <CardHeader className="flex flex-row items-center gap-4">
            <div className="p-3 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
              <User className="size-6" />
            </div>
            <div>
              <CardTitle>Account Details</CardTitle>
              <CardDescription>Update your personal information</CardDescription>
            </div>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
