
"use client";

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';

const images = [
    "/burger.jpg",
    "/ClassicPepperoni.png",
    "/Veggies.png",
    "/SpicyBurger.png",
    "/margherita.jpg",
    "/hawwian.jpg",
    "/BBQ Pizza.jpg",
    "/meat-lovers-pizza-recipe-3.jpg",
    "/Four Cheese Pizza.jpg",
    "/Buffalo chicken pizza.jpg",
    "/high-angle-plate-pizza-with-flowers.jpg",
    "/pizza-pizza-filled-with-tomatoes-salami-olives.jpg",
    "/Cake.jpg",
    "/Bacon BBQ Burger.jpg",
    "/Mushroom Swiss Burger.jpg",
    "/Fish Fillet Burger.jpg",
    "/Avocado Ranch Burger.jpg",
    "/Blue Cheese Burger.jpg",
    "/Teriyaki Pineapple Burger.jpg",
    "/Vegan Black Bean Burger.jpg",
    "/Double Decker Burger.jpg"
];

export const EllipticalCarousel = () => {
    const [index, setIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const nextImage = useCallback(() => {
        setIndex((prev) => (prev + 1) % images.length);
    }, []);

    const prevImage = () => {
        setIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    useEffect(() => {
        if (isHovered || !isClient) return;

        const interval = setInterval(() => {
            nextImage();
        }, 3000);

        return () => clearInterval(interval);
    }, [isHovered, nextImage, isClient]);
    
    const getStyle = (itemIndex: number) => {
        const offset = (itemIndex - index + images.length) % images.length;
        const angle = (offset * 2 * Math.PI) / images.length;

        const isCenter = offset === 0;
        const zIndex = isCenter ? images.length : images.length - Math.min(offset, images.length - offset);
        const scale = isCenter ? 1.2 : 0.7;
        const opacity = isCenter ? 1 : 0.5;
        const blur = isCenter ? 0 : 5;
        
        const x = Math.sin(angle) * 200; // horizontal radius
        const y = Math.cos(angle) * 50 - 50; // vertical radius and upward shift

        return {
            transform: `translate(${x}px, ${y}px) scale(${scale})`,
            opacity,
            zIndex,
            filter: `blur(${blur}px)`,
        };
    };
    
    if (!isClient) {
        return <div className="relative w-full h-[300px]" />; // Return a placeholder or null on the server
    }

    return (
        <div 
            className="relative w-full h-[300px] flex items-center justify-center"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <AnimatePresence>
                {images.map((src, i) => (
                     <motion.div
                        key={src}
                        className="absolute w-[200px] h-[200px] md:w-[250px] md:h-[250px] rounded-full overflow-hidden shadow-2xl"
                        initial={getStyle(i)}
                        animate={getStyle(i)}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                        exit={{ opacity: 0, scale: 0.5 }}
                    >
                        <Image src={src} alt={`carousel image ${i + 1}`} layout="fill" objectFit="cover" />
                    </motion.div>
                ))}
            </AnimatePresence>
            <div className="absolute -bottom-16 flex justify-center w-full gap-4">
                 <Button onClick={prevImage} variant="outline" size="icon" className="w-14 h-14 rounded-full bg-background/50 backdrop-blur-sm shadow-lg hover:bg-primary/20 hover:scale-110 transition-all duration-300 border-2 border-primary/30 hover:shadow-primary/20 hover:shadow-2xl">
                    <ChevronLeft className="h-8 w-8" />
                </Button>
                <Button onClick={nextImage} variant="outline" size="icon" className="w-14 h-14 rounded-full bg-background/50 backdrop-blur-sm shadow-lg hover:bg-primary/20 hover:scale-110 transition-all duration-300 border-2 border-primary/30 hover:shadow-primary/20 hover:shadow-2xl">
                    <ChevronRight className="h-8 w-8" />
                </Button>
            </div>
        </div>
    );
};
