'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import Home from '../../icons/footer/Home'
import HomeActive from '../../icons/footer/HomeActive'
import Event from '../../icons/footer/Event'
import EventActive from '../../icons/footer/EventActive'
import Profile from '../../icons/footer/Profile'
import ProfileActive from '../../icons/footer/ProfileActive'
import Add from '@/components/icons/footer/Add'

const Nav = () => {
  const pathname = usePathname()

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
      <button className='absolute bottom-4 w-auto h-[6rem] flex gap-[10px] items-center justify-between bg-bg-nav backdrop-blur-[15px] text-sm px-8 rounded-full'>
        <Add />
        <p className='font-playfair text-2xl'>Create item</p>
      </button>
    )
  }

  return (
    <div className='absolute bottom-4 w-auto h-[6rem] flex gap-8 items-center justify-between bg-bg-nav backdrop-blur-[15px] text-sm px-8 rounded-full'>
      {navItems.map(({ href, label, icon, activeIcon }) => {
        const isActive = pathname === href
        return (
          <Link
            aria-current={isActive ? 'page' : undefined}
            key={href}
            href={href}
            className={`flex flex-col gap-1 items-center justify-center w-[3rem]
                ${isActive ? 'text-nav-active' : 'text-nav-default hover:text-nav-hover active:text-nav-active'}`}
          >
            {isActive ? activeIcon : icon}
            <p
                className={`
                ${label === 'Yaay!' && isActive ? 'text-[#00A6ED]' : ''}
                `}
            >
                {label}
            </p>
          </Link>
        )
      })}
    </div>
  )
}

export default Nav
