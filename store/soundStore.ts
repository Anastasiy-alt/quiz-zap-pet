import { create } from 'zustand'

interface SoundType {
  on: boolean
  toggle: () => void
}

export const useSoundStore = create<SoundType>((set) => ({
  on: false,

  toggle: () => {
    set(state => ({on: !state.on}))
  },
}))
