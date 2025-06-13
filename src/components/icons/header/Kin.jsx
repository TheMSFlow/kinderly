import React from 'react'

const Kin = () => (
   <div className='flex flex-row gap-2 items-center justify-center'>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="5.23636" r="4.23636" stroke="currentColor" strokeWidth="2"/>
        <path d="M8 14.0908H16C19.866 14.0908 23 17.2248 23 21.0908V22C23 22.5522 22.5523 23 22 23H2C1.44775 23 1.00005 22.5522 1 22V21.0908C1 17.2248 4.13401 14.0908 8 14.0908Z" stroke="currentColor" strokeWidth="2"/>
        </svg>
        <div className='flex flex-col gap-[6px] h-fit'>
            <svg xmlns="http://www.w3.org/2000/svg" width="8" height="5" viewBox="0 0 8 5" fill="none">
            <path d="M1 4L3.29289 1.70711C3.68342 1.31658 4.31658 1.31658 4.70711 1.70711L7 4" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round"/>
            </svg>
            <svg xmlns="http://www.w3.org/2000/svg" width="8" height="5" viewBox="0 0 8 5" fill="none">
            <path d="M1 1L3.29289 3.29289C3.68342 3.68342 4.31658 3.68342 4.70711 3.29289L7 1" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round"/>
            </svg>
        </div>
   </div>
);

export default Kin