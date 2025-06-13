'use client' // Required if you're using Next.js App Router

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import Home from '../icons/footer/Home'
import HomeActive from '../icons/footer/HomeActive'
import Event from '../icons/footer/Event'
import EventActive from '../icons/footer/EventActive'
import Profile from '../icons/footer/Profile'
import ProfileActive from '../icons/footer/ProfileActive'

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

  return (
    <div className='w-full xl:w-[350px] h-[6.25rem] flex pt-2 pb-[22px] xl:pt-0 xl:pb-0 items-center justify-between bg-bg-nav backdrop-blur-[15px] text-sm px-8 xl:px-10 xl:rounded-full'>
      {navItems.map(({ href, label, icon, activeIcon }) => {
        const isActive = pathname === href
        return (
          <Link
            aria-current={isActive ? 'page' : undefined}
            key={href}
            href={href}
            className={`flex flex-col gap-1 items-center justify-center w-[4.5rem] 
                ${isActive ? 'text-nav-active' : 'text-nav-default hover:text-nav-hover active:text-nav-active'}`}
          >
            {isActive ? activeIcon : icon}
            <p
                className={`
                ${label === 'Yaay!' ? '-ml-1' : ''}
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
