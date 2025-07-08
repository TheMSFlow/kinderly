
const ContentWrapMain = ({children}) => {
  return (
    <div className='h-[100vh] w-full flex justify-center items-center overflow-hidden overflow-y-auto hide-scrollbar'>
          {children}
    </div>
  )
}

export default ContentWrapMain