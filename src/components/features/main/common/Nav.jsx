'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useRouter } from 'next/navigation';

import Home from '../../../icons/footer/Home'
import HomeActive from '../../../icons/footer/HomeActive'
import Event from '../../../icons/footer/Event'
import EventActive from '../../../icons/footer/EventActive'
import Profile from '../../../icons/footer/Profile'
import ProfileActive from '../../../icons/footer/ProfileActive'
import Add from '@/components/icons/footer/Add'

const Nav = () => {
  const pathname = usePathname()
  const router = useRouter();

  const navItems = [
    {
      href: '/dashboard',
      label: 'Us',
      icon: <Home />,
      activeIcon: <HomeActive />,
    },
    {
      href: '/events',
      label: 'Yaay!',
      icon: <Event />,
      activeIcon: <EventActive />,
    },
    {
      href: '/profile',
      label: 'Me',
      icon: <Profile />,
      activeIcon: <ProfileActive />,
    },
  ]

   
  if (pathname === '/profile') {
    return (
      <div role="navigation" className="absolute bottom-4">
        <button 
        onClick={() => router.push('/profile/create')}
        className='w-60 h-20 flex gap-2 items-center justify-center bg-bg-nav backdrop-blur-[15px] text-sm px-8 py-4 rounded-full'>
          <Add />
          <p className='font-playfair text-lg'>Create item</p>
        </button>
      </div>
    )
  }

  return (
    <nav className='absolute bottom-4 w-auto flex gap-4 items-center justify-between bg-bg-nav backdrop-blur-[15px] text-sm px-8 py-4 rounded-full'>
      {navItems.map(({ href, label, icon, activeIcon }) => {
        const isActive = pathname === href
        return (
          <Link
            aria-current={isActive ? 'page' : undefined}
            key={href}
            href={href}
            title={label}
            aria-label={label}
            className={`flex flex-col items-center justify-center w-12 h-12 text-xs rounded-lg  
                ${isActive ? 'text-nav-active bg-nav-active-bg' : 'text-nav-default hover:bg-nav-hover active:text-nav-active'}`}
          >
            {isActive ? activeIcon : icon}
            <p className={`${isActive && label === 'Yaay!' ? 'text-text-primary' : ''}`}>
                {label}
            </p>
          </Link>
        )
      })}
    </nav>
  )
}

export default Nav
