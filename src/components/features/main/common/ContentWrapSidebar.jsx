
const ContentWrapSidebar = ({children}) => {
  return (
    <div className='h-full w-full flex justify-center items-start overflow-hidden overflow-y-auto hide-scrollbar pt-12 lg:pt-[6rem] pb-[8rem]'>
          {children}
    </div>
  )
}

export default ContentWrapSidebar