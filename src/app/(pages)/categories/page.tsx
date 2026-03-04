import { CategoriesResponse } from '@/Interfaces/categoriesInterface';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default async function Categories() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`, {
      cache: 'no-store'
    });

    if (!response.ok) {
      return (
        <div className="container mx-auto px-4 py-20 text-center">
          <h2 className="text-2xl font-bold">Failed to load categories.</h2>
          <p className="text-muted-foreground mt-2">Please try again later.</p>
        </div>
      );
    }

    const data: CategoriesResponse = await response.json();

    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-4 text-center md:text-left">
          <div>
            <h1 className="text-4xl font-black tracking-tight">Shop by Category</h1>
            <p className="text-muted-foreground mt-2 font-medium">Explore our curated collections</p>
          </div>
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <ChevronRight className="size-4" />
            <span className="text-foreground">Categories</span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {data?.data && data.data.map((category) => (
            <Link key={category._id} href={`/categories/${category._id}`} className="group">
              <Card className="h-full border-none shadow-hover transition-all duration-500 overflow-hidden cursor-pointer bg-white">
                 <div className="aspect-square relative w-full overflow-hidden">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500" />
                </div>
                <CardContent className="p-6 text-center">
                  <h3 className="text-xl font-bold group-hover:text-primary transition-colors flex items-center justify-center gap-2">
                    {category.name}
                    <ChevronRight className="size-4 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                  </h3>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    );
  } catch (error) {
    console.error('Fetch failed for categories:', error);
    return <div>Failed to load categories due to a network error.</div>;
  }
}
