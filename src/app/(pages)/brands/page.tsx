import { BrandsResponse } from '@/Interfaces/brandsInterface';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default async function Brands() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/brands`, {
      cache: 'no-store'
    });

    if (!response.ok) {
        return (
          <div className="container mx-auto px-4 py-20 text-center">
            <h2 className="text-2xl font-bold">Failed to load brands.</h2>
            <p className="text-muted-foreground mt-2">Please try again later.</p>
          </div>
        );
    }

    const data: BrandsResponse = await response.json();

    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-4 text-center md:text-left">
          <div>
            <h1 className="text-4xl font-black tracking-tight">Our Premium Brands</h1>
            <p className="text-muted-foreground mt-2 font-medium">We partner with the best in the industry</p>
          </div>
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <ChevronRight className="size-4" />
            <span className="text-foreground">Brands</span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {data?.data &&
            data.data.map((brand) => (
            <Link key={brand._id} href={`/brands/${brand._id}`} className="group">
              <Card className="h-full border border-accent/20 hover:border-primary/50 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden cursor-pointer bg-white">
                <div className="aspect-square relative w-full overflow-hidden p-8 flex items-center justify-center bg-accent/5">
                   <Image
                      src={brand.image}
                      alt={brand.name}
                      fill
                      className="object-contain p-8 transition-transform duration-700 group-hover:scale-110"
                    />
                </div>
                <CardContent className="p-6 text-center">
                  <h3 className="text-lg font-black group-hover:text-primary transition-colors uppercase tracking-widest">{brand.name}</h3>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    );
  } catch (error) {
    console.error('Fetch failed for brands:', error);
    return <div>Failed to load brands due to a network error.</div>;
  }
}
