
"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

interface EllipticalCarouselProps {
  images: string[];
  autoplayInterval?: number;
}

export const EllipticalCarousel: React.FC<EllipticalCarouselProps> = ({ images, autoplayInterval = 5000 }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const autoplayTimerRef = useRef<NodeJS.Timeout | null>(null);

  const totalImages = images.length;

  const goToNext = useCallback(() => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % totalImages);
  }, [totalImages]);

  const goToPrev = () => {
    setActiveIndex((prevIndex) => (prevIndex - 1 + totalImages) % totalImages);
  };
  
  useEffect(() => {
    if (!isHovered && autoplayInterval) {
      autoplayTimerRef.current = setInterval(goToNext, autoplayInterval);
    }
    return () => {
      if (autoplayTimerRef.current) {
        clearInterval(autoplayTimerRef.current);
      }
    };
  }, [isHovered, autoplayInterval, goToNext]);


  const getStyle = (index: number) => {
    const offset = (index - activeIndex + totalImages) % totalImages;
    const angle = (offset / totalImages) * 2 * Math.PI;

    const ellipseWidth = 300; // width of the ellipse
    const ellipseHeight = 100; // height of the ellipse, creating the 3D effect
    const centerX = 0; // assuming the carousel is centered
    
    // Use cosine for x-axis to spread items horizontally
    const x = centerX + ellipseWidth * Math.cos(angle - Math.PI / 2);
    // Use sine for z-axis to create depth
    const z = ellipseHeight * Math.sin(angle - Math.PI / 2);
    
    // Scale and opacity based on depth (z-index)
    const scale = z > 0 ? 1 : 0.6 + (z / ellipseHeight) * 0.4;
    const opacity = z > 0 ? 1 : 0.5 + (z / ellipseHeight) * 0.5;
    const zIndex = Math.round(z);

    return {
      transform: `translateX(${x}px) translateZ(${z}px) scale(${scale})`,
      opacity,
      zIndex,
      transition: 'transform 0.5s ease-out, opacity 0.5s ease-out',
    };
  };

  return (
    <div 
      className="w-full flex flex-col items-center justify-center gap-4"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
        <div 
          className="relative w-full h-[300px] md:h-[400px] flex items-center justify-center"
          style={{ perspective: '1000px' }}
        >
          <div className="absolute w-full h-full" style={{ transformStyle: 'preserve-3d' }}>
            {images.map((src, index) => (
              <div
                key={index}
                className="absolute top-0 left-0 w-full h-full flex items-center justify-center"
                style={getStyle(index)}
              >
                <div className={cn(
                    "relative w-[200px] h-[200px] md:w-[300px] md:h-[300px] rounded-full overflow-hidden shadow-2xl",
                    activeIndex === index && "border-4 border-primary"
                )}>
                  <Image
                    src={src}
                    alt={`Carousel image ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 200px, 300px"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      
        <div className="flex items-center justify-center gap-4 z-30">
            <Button 
                variant="secondary"
                size="icon" 
                className="rounded-full shadow-md transition-all hover:bg-primary/20 hover:scale-110"
                onClick={goToPrev}
            >
                <ChevronLeft className="h-6 w-6" />
            </Button>
            <Button 
                variant="secondary"
                size="icon" 
                className="rounded-full shadow-md transition-all hover:bg-primary/20 hover:scale-110"
                onClick={goToNext}
            >
                <ChevronRight className="h-6 w-6" />
            </Button>
        </div>
    </div>
  );
};
