import { itemsBeacauseSection } from '@/constants/becauseSection'

/* ➡ Componente que renderiza todos los items de la seccion "¿Por qué LunchFip?" */
export const ItemsBecauseCards = () => {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 py-10 mt-5 gap-7">
      {
        itemsBeacauseSection.map(({ icon, title, description }) => (
          <article key={title} className='p-6 border border-neutral-300 dark:border-neutral-600 rounded-xl'>
            <div className='w-[60px] h-[60px] flex justify-center items-center p-2 rounded-full border border-neutral-200 dark:border-neutral-700 mb-4'>
              <div className='w-full h-full rounded-full flex justify-center items-center p-[10px] border border-neutral-300 dark:border-neutral-600'>
                {icon}
              </div>
            </div>
            <h3 className='text-lg font-semibold'>{title}</h3>
            <p className='text-neutral-600 dark:text-neutral-400 mt-1 transition-all'>{description}</p>
          </article>
        ))
      }
    </section>
  )
}
