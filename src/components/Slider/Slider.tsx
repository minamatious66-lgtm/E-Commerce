"use client"
import React from 'react'
import Image from 'next/image';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"
import Autoplay from 'embla-carousel-autoplay';
export default function Slider({image , title}: {image : string[], title : string}) {
  return<>
  <Carousel opts={{loop:true, }} plugins={[
        Autoplay({
          delay: 1000,
        }),
      ]}
>
  <CarouselContent>
      {image.map((img, index) =>
          <CarouselItem key={index}>
          <Image src={img} alt={title} width={400} height={300} className="w-full"/>

    </CarouselItem>)}
  </CarouselContent>
 
</Carousel>
  </>
}
