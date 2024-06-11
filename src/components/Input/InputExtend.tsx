import { extendVariants, Input } from '@nextui-org/react'

export const MyInput = extendVariants(Input, {
  variants: {
    color: {
      stone: {
        inputWrapper: [
          'bg-zinc-50',
          'border',
          'shadow',
          'transition-colors',
          'focus-within:bg-white',
          'data-[hover=true]:border-transparent',
          'data-[hover=true]:bg-white',
          'group-data-[focus=true]:border-transparent',
          'group-data-[focus=true]:bg-white',
          // dark theme
          'dark:bg-zinc-900',
          'dark:border-zinc-800',
          'dark:data-[hover=true]:bg-zinc-800',
          'dark:focus-within:bg-zinc-900',
          'dark:group-data-[focus=true]:bg-zinc-800'
        ]
      }
    },
    isDisabled: {
      true: {
        base: [
          'opacity-1'
        ],
        label: [
          'text-zinc-400 dark:text-zinc-500'
        ],
        input: [
          'text-zinc-400 dark:text-zinc-500'
        ]
      }
    }
  }
})
