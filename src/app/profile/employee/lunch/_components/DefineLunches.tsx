import { FormDefineLunches } from './FormDefineLunches'

interface DefineLunchesProps {
  nextDate: Date
  nextFullDate: string
}

export const DefineLunches = ({ nextDate, nextFullDate }: DefineLunchesProps) => {
  return (
    <section>
      <h1 className='flex items-center flex-wrap text-4xl font-extrabold tracking-tighter gap-2'>
        Definir
        <span className='relative bg-clip-text [-webkit-background-clip:text] [-webkit-text-fill-color:transparent] animate-color-cycle-5'>Almuerzos</span>
      </h1>
      <FormDefineLunches
        nextDate={nextDate}
        nextFullDate={nextFullDate}
      />
    </section>
  )
}
