/* ➡ Componente del title principal de la Home Page */
export const Title = () => {
  return (
    <div className='relative z-10 flex flex-col justify-center items-center h-56'>
      <div className='relative flex justify-center items-center'>
        <span className='bg-clip-text text-transparent bg-gradient-to-b dark:from-white dark:to-neutral-400 from-black/80 to-black'>Reserva.</span>
        <span className='absolute top-0 bg-clip-text text-transparent bg-gradient-to-r from-color-primary to-color-secondary animate-color-cycle-1'>Reserva.</span>
      </div>
      <div className='relative flex justify-center items-center'>
        <span className='bg-clip-text text-transparent bg-gradient-to-b dark:from-white dark:to-neutral-400 from-black/80 to-black'>Escanea.</span>
        <span className='absolute top-0 bg-clip-text text-transparent bg-gradient-to-r from-color-primary to-color-secondary animate-color-cycle-2'>Escanea.</span>
      </div>
      <div className='relative flex justify-center items-center'>
        <span className='bg-clip-text text-transparent bg-gradient-to-b dark:from-white dark:to-neutral-400 from-black/80 to-black'>Disfruta.</span>
        <span className='absolute top-0 bg-clip-text text-transparent bg-gradient-to-r from-color-primary to-color-secondary animate-color-cycle-3'>Disfruta.</span>
      </div>
    </div>
  )
}
