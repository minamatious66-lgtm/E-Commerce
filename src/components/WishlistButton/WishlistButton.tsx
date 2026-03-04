"use client";
import { Heart } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { WishlistAddResponse } from "@/Interfaces/wishlistInterface";

interface WishlistButtonProps {
  productId: string;
}

export default function WishlistButton({ productId }: WishlistButtonProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleWishlist = async () => {
    if (!session) {
      toast.error("Please login to add to wishlist");
      router.push("/login");
      return;
    }

    setIsLoading(true);

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const token = (session as any).accessToken;
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/wishlist`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            token: token,
          },
          body: JSON.stringify({ productId }),
        }
      );

      const data: WishlistAddResponse = await response.json();

      if (response.ok) {
        setIsInWishlist(true);
        toast.success(data.message || "Added to wishlist");
      } else {
        toast.error("Failed to add to wishlist");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleWishlist}
      disabled={isLoading}
      className="p-2 hover:scale-110 transition-transform"
      aria-label="Add to wishlist"
    >
      <Heart
        className={`size-6 cursor-pointer ${
          isInWishlist
            ? "fill-red-500 text-red-500"
            : "text-gray-600 hover:text-red-500"
        }`}
      />
    </button>
  );
}
