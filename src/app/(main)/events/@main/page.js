'use client'

import React from 'react'
import ContentWrapMain from '@/components/features/main/common/ContentWrapMain'
import EventDefaultState from '@/components/features/main/event/EventDefaultState'

const EventsMain = () => {
 
  return (
    <>
          <ContentWrapMain>
            <EventDefaultState main={true}/>
          </ContentWrapMain>
    </>
  )
}

export default EventsMain