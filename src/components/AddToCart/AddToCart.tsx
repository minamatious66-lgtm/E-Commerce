"use client"
import React, { useState } from 'react'
import { CardFooter } from '../ui/card'
import { Button } from '../ui/button'
import { Loader2, ShoppingCart } from 'lucide-react'
import { CartRes } from '@/Interfaces/CartInterface'
import toast from 'react-hot-toast'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import WishlistButton from '../WishlistButton/WishlistButton'

export default function AddToCart({productId}: {productId : string}) {
    const [isLoading, setLoading] = useState(false)
    const { data: session } = useSession()
    const router = useRouter()

    async function addToCart(productId: string) {
        if (!session) {
            toast.error("Please login to add items to cart")
            router.push("/login")
            return
        }

        try{
            setLoading(true)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const token = (session as any).accessToken
            const response = await fetch('https://ecommerce.routemisr.com/api/v1/cart', {
                method: 'POST',
                body: JSON.stringify({ productId }),
                headers:{
                    token: token,
                    'Content-Type': 'application/json'
                }
                
            });
            const data: CartRes = await response.json();
            toast.success(data.message + '')
            console.log(data);
        }
        catch(err){
            console.log(err);
            toast.error("Failed to add to cart")
        }
        setLoading(false)
    }
    
    
  return <>
    <CardFooter className="gap-2">
    
    <Button disabled={isLoading} onClick={()=> addToCart(productId)} className="grow gap-2">
        {isLoading ? <Loader2 className="animate-spin"/> : <ShoppingCart/>}Add to cart</Button>
    <WishlistButton productId={productId} />
  </CardFooter>
  </>
}
