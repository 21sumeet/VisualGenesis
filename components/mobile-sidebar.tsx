"use client";

import React from 'react'
import { Menu, User } from 'lucide-react'
import { Button } from './ui/button'
import { Sheet, SheetTrigger, SheetContent } from './ui/sheet';
import  Sidebar  from '@/components/sidebar';
import { useState, useEffect } from 'react';


const MobileSidebar = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }
  return (
    <Sheet>
        <SheetTrigger>
        <div>
            <Button className='md:hidden' variant={'ghost'} size={'icon'}>
            <Menu />
            </Button>
        </div>
        </SheetTrigger>
        <SheetContent side="left" className="p-0">
           <Sidebar  />
      </SheetContent>
    </Sheet>
   
  )
}

export default MobileSidebar