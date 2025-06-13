export default function MainLayout({ sidebar, main }) {
  return (
        <>
            <div className='bg-bg-primary-mainbar block xl:grid xl:grid-cols-[430px_minmax(0,1fr)] grid-rows-1 gap-0 min-h-screen w-full text-text-primary'>
{/* Mobile and Tablet */}
            <section className='relative'>
                <div className='absolute top-0 left-0 w-full h-full flex items-center justify-center xl:bg-bg-primary-sidebar'>
                    {sidebar}
                </div>
            </section>
{/* Desktop only */}
            <section className='hidden xl:block relative'>
                <div className='flex flex-col justify-center items-center w-full h-full'>
                    {main}
                </div>
            </section>
            </div>
        </>
  );
}
