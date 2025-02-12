import { Menu, User } from 'lucide-react'
import { Button } from './ui/button'
import React from 'react'
import { UserButton } from '@clerk/nextjs'
import MobileSidebar from './mobile-sidebar'

const Navbar = () => {
  return (
    
    <div className='flex bg-slate-100 iteam-center p-4'>
      <MobileSidebar/>
      <div className='flex w-full justify-end'>
        <UserButton afterSignOutUrl='/' />
      </div> {/* Properly closed this div */}
    </div>
    
  );
}

export default Navbar;