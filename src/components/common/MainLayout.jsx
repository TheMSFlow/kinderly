export default function MainLayout({ sidebar, main }) {
  return (
        <>
            <div className='bg-bg-primary-mainbar block lg:grid lg:grid-cols-[400px_minmax(0,1fr)] xl:grid-cols-[430px_minmax(0,1fr)] grid-rows-1 gap-0 min-h-screen w-full text-text-primary'>
{/* Mobile and Tablet */}
            <section className='relative h-screen bg-bg-primary-sidebar'>
                <div className='w-full h-full'>
                    {sidebar}
                </div>
            </section>
{/* Desktop only */}
            <section className='hidden lg:block relative'>
                <div className='flex flex-col justify-center items-center w-full h-full'>
                    {main}
                </div>
            </section>
            </div>
        </>
  );
}
