import useEstudianteEstadisticas from '@/hooks/useEstudianteEstadisticas'
import { StatCard } from './StatCard'
import { useEstudiante } from '@/hooks/useEstudiante'

export const StudentStats = () => {
  const { estudiante: { id_estudiante: idEstudiante } } = useEstudiante()
  const {
    cantidadReservas,
    cantidadReclamados,
    cantidadSinReclamar,
    cantidadRecargas,
    fechaUltimaReserva,
    fechaUltimoReclamo,
    fechaUltimaRecarga,
    loadingStudentStats
  } = useEstudianteEstadisticas({ idEstudiante })

  return (
    <section className="flex flex-col justify-center items-center gap-7">
      <p className='w-full z-10 -mt-2 text-center italic text-p-light dark:text-p-dark'>Aqui encontrarás la cantidad total de almuerzos que has reservado o reclamado hasta la actualidad, así como también la cantidad total de almuerzos que no has reclamado.</p>
      <div className='grid grid-cols-1 md:grid-cols-2 place-items-center gap-5'>
        <StatCard
          label="Total Almuerzos Reservados"
          value={cantidadReservas}
          loading={loadingStudentStats}
        />
        <StatCard
          label="Total Almuerzos Reclamados"
          value={cantidadReclamados}
          loading={loadingStudentStats}
        />
        <StatCard
          label="Total Almuerzos Sin Reclamar"
          value={cantidadSinReclamar}
          loading={loadingStudentStats}
        />
        <StatCard
          label="Total De Recargas Realizadas"
          value={cantidadRecargas}
          loading={loadingStudentStats}
        />
        <StatCard
          label="Fecha De La Última Reserva"
          value={fechaUltimaReserva}
          loading={loadingStudentStats}
        />
        <StatCard
          label="Fecha Del Último Reclamo"
          value={fechaUltimoReclamo}
          loading={loadingStudentStats}
        />
        <StatCard
          label="Fecha De La Última Recarga"
          value={fechaUltimaRecarga}
          loading={loadingStudentStats}
        />
      </div>
    </section>
  )
}
