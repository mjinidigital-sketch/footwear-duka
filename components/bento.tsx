"use client";

import React from "react";
import { ArrowUpRight, ShoppingBag, Star, Zap, TrendingUp, Flame, Heart, Clock, Award, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function EcommerceBentoHero() {
  return (
    <section className="mt-24 w-full min-h-screen py-8 px-4 md:px-6 lg:px-8 bg-zinc-50 text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50 transition-colors duration-200">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[180px] md:auto-rows-[200px]">

        {/* Cell 1: Hero Banner (Large 2x2 Feature) */}
        <Card className="col-span-1 md:col-span-2 lg:col-span-2 row-span-2 overflow-hidden relative group border-zinc-200 dark:border-zinc-800 shadow-2xl">
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1608231387042-66d1773070a5?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Hero sneaker"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
          </div>

          <div className="absolute inset-0 flex flex-col justify-end p-4 md:p-6 z-10">
            <Badge className="bg-white/20 backdrop-blur-md text-white border-white/30 w-fit mb-2 md:mb-3 font-semibold text-xs md:text-sm">
              New Collection 2024
            </Badge>
            <CardTitle className="text-2xl md:text-4xl lg:text-5xl font-black text-white mb-1 md:mb-2 leading-tight">
              REDEFINE<br />YOUR STRIDE
            </CardTitle>
            <CardDescription className="text-zinc-200 text-xs md:text-sm lg:text-base max-w-sm mb-2 md:mb-4">
              Premium comfort meets street style. Discover our latest exclusive drops.
            </CardDescription>
            <Button className="bg-white text-zinc-950 hover:bg-zinc-100 w-fit font-bold shadow-xl text-xs md:text-sm">
              Shop Now <ArrowUpRight className="w-3 h-3 md:w-4 md:h-4 ml-2" />
            </Button>
          </div>
        </Card>

        {/* Cell 2: Product Highlight (1x1) with Image Background */}
        <Card className="relative overflow-hidden group border-zinc-200 dark:border-zinc-800 shadow-lg hover:shadow-xl transition-all">
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Nike Air Max"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          </div>

          <div className="absolute top-3 right-3 z-10">
            <Heart className="w-4 h-4 text-white/80 group-hover:text-red-500 group-hover:fill-red-500 transition-colors cursor-pointer" />
          </div>

          <div className="absolute inset-0 flex flex-col justify-end p-3 md:p-4 z-10">
            <Badge className="bg-amber-500/90 text-zinc-950 border-amber-400 w-fit mb-1 md:mb-2 font-bold text-[10px] md:text-xs">
              Running
            </Badge>
            <CardTitle className="text-sm md:text-lg font-black text-white mb-1">Air Max Pulse</CardTitle>
            <div className="flex items-center justify-between">
              <span className="text-base md:text-xl font-black text-white">Ksh 4500</span>
              <div className="flex items-center gap-1 text-amber-400">
                <Star className="w-2.5 h-2.5 md:w-3 md:h-3 fill-amber-400" />
                <span className="text-[10px] md:text-xs font-bold text-white">4.8</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Cell 3: Stats Card (1x1) with Image Background */}
        <Card className="relative overflow-hidden group border-zinc-200 dark:border-zinc-800 shadow-lg hover:shadow-xl transition-all">
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1556906781-9a412961c28c?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Stats background"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 to-indigo-900/80" />
          </div>

          <div className="absolute inset-0 flex flex-col justify-between p-3 md:p-4 z-10">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="p-1.5 md:p-2 bg-white/20 backdrop-blur-sm rounded-lg">
                <TrendingUp className="w-4 h-4 md:w-5 md:h-5 text-white" />
              </div>
              <Badge className="bg-white/20 backdrop-blur-sm text-white border-white/30 font-bold text-[10px] md:text-xs">
                HOT
              </Badge>
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-black text-white">+247%</div>
              <div className="text-[10px] md:text-xs text-white/80 font-medium mt-1">Sales this week</div>
            </div>
          </div>
        </Card>

        {/* Cell 4: Product Card (1x1) with Image Background */}
        <Card className="relative overflow-hidden group border-zinc-200 dark:border-zinc-800 shadow-lg hover:shadow-xl transition-all">
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Jordan Retro"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          </div>

          <div className="absolute top-3 right-3 z-10">
            <Heart className="w-4 h-4 text-white/80 group-hover:text-red-500 group-hover:fill-red-500 transition-colors cursor-pointer" />
          </div>

          <div className="absolute inset-0 flex flex-col justify-end p-3 md:p-4 z-10">
            <Badge className="bg-red-500/90 text-white border-red-400 w-fit mb-1 md:mb-2 font-bold text-[10px] md:text-xs">
              Basketball
            </Badge>
            <CardTitle className="text-sm md:text-lg font-black text-white mb-1">Jordan Retro 1</CardTitle>
            <div className="flex items-center justify-between">
              <span className="text-base md:text-xl font-black text-white">Ksh 3500</span>
              <div className="flex items-center gap-1 text-amber-400">
                <Star className="w-2.5 h-2.5 md:w-3 md:h-3 fill-amber-400" />
                <span className="text-[10px] md:text-xs font-bold text-white">4.9</span>
              </div>
            </div>
          </div>
        </Card>


        {/* Cell 7: Limited Drop (1x1) with Image Background */}
        <Card className="relative overflow-hidden group border-zinc-200 dark:border-zinc-800 shadow-lg hover:shadow-xl transition-all">
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Sale background"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-red-900/80 to-orange-900/80" />
          </div>

          <div className="absolute top-3 right-3 z-10">
            <Badge className="bg-white/20 backdrop-blur-sm text-white border-white/30 font-bold text-xs">
              Limited
            </Badge>
          </div>

          <div className="absolute inset-0 flex flex-col justify-center p-3 md:p-4 z-10">
            <div className="flex items-center gap-2 mb-1 md:mb-2">
              <Clock className="w-3 h-3 md:w-4 md:h-4 text-white" />
              <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-white">Flash Sale</span>
            </div>
            <div className="text-2xl md:text-3xl font-black text-white mb-1">50% OFF</div>
            <div className="text-[10px] md:text-xs text-white/90 mb-2 md:mb-3">Selected items only</div>
            <Button className="bg-white text-red-600 hover:bg-zinc-100 font-bold text-[10px] md:text-xs w-fit">
              Shop Sale
            </Button>
          </div>
        </Card>

        {/* Cell 5: Feature Banner (2x1) with Image Background */}
        <Card className="col-span-1 md:col-span-2 lg:col-span-2 overflow-hidden relative border-zinc-200 dark:border-zinc-800 shadow-xl">
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Tech background"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-zinc-900/90 to-zinc-800/90" />
          </div>

          <div className="relative z-10 flex items-center justify-between p-3 md:p-5 h-full">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1 md:mb-2">
                <Zap className="w-3 h-3 md:w-4 md:h-4 text-amber-400" />
                <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-amber-400">New Technology</span>
              </div>
              <CardTitle className="text-base md:text-lg lg:text-xl font-black mb-1 text-white">AIR-ZERO™ Technology</CardTitle>
              <p className="text-[10px] md:text-xs text-zinc-300 max-w-xs">Ultra-lightweight cushioning for maximum performance.</p>
            </div>
            <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm font-bold text-[10px] md:text-xs shrink-0 ml-2 md:ml-4">
              Learn More
            </Button>
          </div>
        </Card>

        {/* Cell 8: Brand Story (2x1) with Image Background */}
        <Card className="col-span-1 md:col-span-2 lg:col-span-2 overflow-hidden relative border-zinc-200 dark:border-zinc-800 shadow-lg">
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1552346154-21d32810aba3?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Brand story"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-zinc-900/90 to-zinc-800/70" />
          </div>

          <div className="relative z-10 flex items-center h-full p-3 md:p-5 gap-3 md:gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1 md:mb-2">
                <Flame className="w-3 h-3 md:w-4 md:h-4 text-orange-500" />
                <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-orange-500">Our Story</span>
              </div>
              <CardTitle className="text-base md:text-lg lg:text-xl font-black text-white mb-1 md:mb-2">
                Crafted for Excellence
              </CardTitle>
              <p className="text-[10px] md:text-xs text-zinc-300 max-w-sm">
                Every pair is designed with precision engineering and premium materials for unmatched comfort and style.
              </p>
            </div>
          </div>
        </Card>

      </div>
    </section>
  );
}
