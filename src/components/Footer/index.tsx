'use client'

import { cn } from '@/libs/utils'
import Image from 'next/image'
import { Link } from 'next-view-transitions'
import { usePathname } from 'next/navigation'

export const Footer = () => {
  const pathname = usePathname()

  return (
    <footer className="font-inter-sans">
      <div className="container px-6 py-8 mx-auto">
        <div className="flex flex-col items-center text-center">
          <Link
            href='/'
            className='flex justify-center items-center'
          >
            <Image
              src='/svgs/logo-lunchfip-dark.svg'
              alt='logo lunchfip'
              width={130}
              height={130}
              className='hidden dark:flex w-32'
            />
            <Image
              src='/svgs/logo-lunchfip-light.svg'
              alt='logo lunchfip'
              width={130}
              height={130}
              className='flex dark:hidden w-32'
            />
          </Link>

          <div className="flex flex-wrap justify-center mt-6 -mx-4">
            <Link
              href="/"
              className={cn(
                'mx-4 text-sm transition-colors duration-300 hover:text-color-primary',
                pathname === '/' ? 'text-black dark:text-white font-semibold' : 'text-nav-link-light dark:text-nav-link-dark'
              )}
            >
              {' '}
              Inicio{' '}
            </Link>

            <Link
              href="/about"
              className={cn(
                'mx-4 text-sm transition-colors duration-300 hover:text-color-primary',
                pathname === '/about' ? 'text-black dark:text-white font-semibold' : 'text-nav-link-light dark:text-nav-link-dark'
              )}
            >
              {' '}
              Nosotros{' '}
            </Link>

          </div>
        </div>

        <hr className="my-6 border-gray-200 md:my-10 dark:border-gray-700" />

        <div className="flex flex-col gap-5 items-center sm:gap-0 sm:flex-row sm:justify-between">
          <p className="text-sm text-gray-500 dark:text-gray-300">
            © 2024 LunchFip | Derechos Reservados.
          </p>

          <div className="flex -mx-2">
            <Link
              href="#"
              className="mx-2 text-gray-600 transition-colors duration-300 dark:text-gray-300 hover:text-color-primary"
            >
              <svg
                className="w-6 h-6 fill-current"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path d="M11.999 7.377a4.623 4.623 0 100 9.248 4.623 4.623 0 000-9.248zm0 7.627a3.004 3.004 0 110-6.008 3.004 3.004 0 010 6.008z" />
                <path d="M17.884 7.207 A1.078 1.078 0 0 1 16.806 8.285 A1.078 1.078 0 0 1 15.728000000000002 7.207 A1.078 1.078 0 0 1 17.884 7.207 z" />
                <path d="M20.533 6.111A4.605 4.605 0 0017.9 3.479a6.606 6.606 0 00-2.186-.42c-.963-.042-1.268-.054-3.71-.054s-2.755 0-3.71.054a6.554 6.554 0 00-2.184.42 4.6 4.6 0 00-2.633 2.632 6.585 6.585 0 00-.419 2.186c-.043.962-.056 1.267-.056 3.71 0 2.442 0 2.753.056 3.71.015.748.156 1.486.419 2.187a4.61 4.61 0 002.634 2.632 6.584 6.584 0 002.185.45c.963.042 1.268.055 3.71.055s2.755 0 3.71-.055a6.615 6.615 0 002.186-.419 4.613 4.613 0 002.633-2.633c.263-.7.404-1.438.419-2.186.043-.962.056-1.267.056-3.71s0-2.753-.056-3.71a6.581 6.581 0 00-.421-2.217zm-1.218 9.532a5.043 5.043 0 01-.311 1.688 2.987 2.987 0 01-1.712 1.711 4.985 4.985 0 01-1.67.311c-.95.044-1.218.055-3.654.055-2.438 0-2.687 0-3.655-.055a4.96 4.96 0 01-1.669-.311 2.985 2.985 0 01-1.719-1.711 5.08 5.08 0 01-.311-1.669c-.043-.95-.053-1.218-.053-3.654 0-2.437 0-2.686.053-3.655a5.038 5.038 0 01.311-1.687c.305-.789.93-1.41 1.719-1.712a5.01 5.01 0 011.669-.311c.951-.043 1.218-.055 3.655-.055s2.687 0 3.654.055a4.96 4.96 0 011.67.311 2.991 2.991 0 011.712 1.712 5.08 5.08 0 01.311 1.669c.043.951.054 1.218.054 3.655 0 2.436 0 2.698-.043 3.654h-.011z" />
              </svg>
            </Link>

            <Link
              href="#"
              className="mx-2 text-gray-600 transition-colors duration-300 dark:text-gray-300 hover:text-color-primary"
            >
              <svg
                className="w-6 h-6 fill-current"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path d="M12.001 2.002c-5.522 0-9.999 4.477-9.999 9.999 0 4.99 3.656 9.126 8.437 9.879v-6.988h-2.54v-2.891h2.54V9.798c0-2.508 1.493-3.891 3.776-3.891 1.094 0 2.24.195 2.24.195v2.459h-1.264c-1.24 0-1.628.772-1.628 1.563v1.875h2.771l-.443 2.891h-2.328v6.988C18.344 21.129 22 16.992 22 12.001c0-5.522-4.477-9.999-9.999-9.999z" />
              </svg>
            </Link>

            <Link
              href="#"
              className="mx-2 text-gray-600 transition-colors duration-300 dark:text-gray-300 hover:text-color-primary"
            >
              <svg
                className="w-6 h-6 fill-current"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path d="M21.593 7.203a2.506 2.506 0 00-1.762-1.766C18.265 5.007 12 5 12 5s-6.264-.007-7.831.404a2.56 2.56 0 00-1.766 1.778c-.413 1.566-.417 4.814-.417 4.814s-.004 3.264.406 4.814c.23.857.905 1.534 1.763 1.765 1.582.43 7.83.437 7.83.437s6.265.007 7.831-.403a2.515 2.515 0 001.767-1.763c.414-1.565.417-4.812.417-4.812s.02-3.265-.407-4.831zM9.996 15.005l.005-6 5.207 3.005-5.212 2.995z" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
