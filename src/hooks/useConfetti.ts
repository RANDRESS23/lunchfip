import { useRef } from 'react'

/* ➡ Hook para manejar el confetti canvas */
export const useConfetti = () => {
  const controller = useRef()

  const onInitHandler = ({ conductor }: { conductor: any }) => {
    controller.current = conductor
  }

  const onShoot = () => {
    if (controller.current !== undefined) {
      (controller.current as { shoot: () => void }).shoot()
    }
  }

  return {
    onInitHandler,
    onShoot
  }
}
