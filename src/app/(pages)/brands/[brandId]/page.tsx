// import { ProductResponse } from '@/Interfaces/productInterface';
// import AddToCart from '@/components/AddToCart/AddToCart';
// import WishlistButton from '@/components/WishlistButton/WishlistButton';
// import { Card, CardContent } from '@/components/ui/card';
// import { Star, ChevronRight, PackageSearch } from 'lucide-react';
// import Image from 'next/image';
// import Link from 'next/link';
// import { Params } from 'next/dist/server/request/params';

// export default async function BrandProducts({ params }: { params: Params }) {
//   try {
//     const { brandId } = await params;

//     const response = await fetch(
//       `${process.env.NEXT_PUBLIC_API_URL}/products?brand=${brandId}`,
//       { cache: 'no-store' }
//     );

//     if (!response.ok) {
//       return (
//         <div className="container mx-auto px-4 py-20 text-center">
//           <h2 className="text-2xl font-bold">Failed to load brand products.</h2>
//           <p className="text-muted-foreground mt-2">Please try again later.</p>
//         </div>
//       );
//     }

//     const data: ProductResponse = await response.json();

//     return (
//       <div className="container mx-auto px-4 py-12">
//         <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-4">
//           <div>
//             <h1 className="text-4xl font-black tracking-tight">Brand Products</h1>
//             <p className="text-muted-foreground mt-2 font-medium">Discover items from your favorite brand</p>
//           </div>
//           <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
//             <Link href="/" className="hover:text-primary transition-colors">Home</Link>
//             <ChevronRight className="size-4" />
//             <Link href="/brands" className="hover:text-primary transition-colors">Brands</Link>
//             <ChevronRight className="size-4" />
//             <span className="text-foreground">Products</span>
//           </div>
//         </div>

//         {data?.data && data.data.length > 0 ? (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
//             {data.data.map((product) => (
//               <Card key={product.id || product._id} className="group overflow-hidden border-none shadow-hover transition-all duration-300 hover:-translate-y-2">
//                 <div className="relative aspect-[4/5] overflow-hidden bg-accent/10">
//                   <Image
//                     src={product.imageCover || ''}
//                     alt={product.title || ''}
//                     fill
//                     className="object-cover group-hover:scale-105 transition-transform duration-500"
//                   />
//                   <div className="absolute top-4 right-4 z-10">
//                     <WishlistButton productId={product.id || product._id || ''} />
//                   </div>
//                   <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-black/80 to-transparent">
//                     <AddToCart productId={product.id || product._id || ''} />
//                   </div>
//                 </div>
//                 <CardContent className="p-4 space-y-3">
//                   <div className="flex justify-between items-start">
//                     <p className="text-[10px] text-primary font-black uppercase tracking-widest">{product.category?.name}</p>
//                     <div className="flex items-center gap-1 text-xs">
//                        <Star className="size-3 fill-yellow-400 text-yellow-400" />
//                        <span className="font-bold">{product.ratingsAverage}</span>
//                     </div>
//                   </div>
//                   <Link href={`/products/${product.id || product._id}`}>
//                     <h3 className="font-bold text-lg line-clamp-1 group-hover:text-primary transition-colors leading-tight">
//                       {product.title}
//                     </h3>
//                   </Link>
//                   <div className="flex items-baseline gap-2 pt-1">
//                     <span className="text-xl font-black text-primary">
//                       {product.priceAfterDiscount ? product.priceAfterDiscount : product.price} EGP
//                     </span>
//                     {product.priceAfterDiscount && (
//                        <span className="text-sm text-muted-foreground line-through opacity-50">{product.price} EGP</span>
//                     )}
//                   </div>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//         ) : (
//           <div className="py-20 text-center border-2 border-dashed rounded-3xl">
//             <PackageSearch className="size-16 mx-auto text-muted-foreground mb-4 opacity-50" />
//             <h2 className="text-xl font-bold">No products found</h2>
//             <p className="text-muted-foreground">This brand doesn&apos;t have any products currently.</p>
//           </div>
//         )}
//       </div>
//     );
//   } catch (error) {
//     console.error('Fetch failed for brand products:', error);
//     return <div>Failed to load products due to a network error.</div>;
//   }
// }


interface BrandPageProps {
  params: { brandId: string };
}

export default async function BrandPage({ params }: BrandPageProps) {
  const { brandId } = params;

  // لو عندك API جاهز:
  const brandData = await fetch(`https://your-api.com/brands/${brandId}`);
  const data = await brandData.json();

  return (
    <div>
      <h1>{data.name}</h1>
      <p>{data.description}</p>
    </div>
  );
}