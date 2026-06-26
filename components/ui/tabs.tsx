'use client'

import {useEffect, useRef, useState} from 'react'
import stl from './ui.module.sass'

interface Tab {
  label: string
  value: string
}

interface Props {
  tabs: Tab[]
  value: string
  onChange: (value: string) => void
}

export default function Tabs({tabs, value, onChange}: Props) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const sliderRef = useRef<HTMLDivElement>(null)
  const btnRefs = useRef<(HTMLButtonElement | null)[]>([])

  const updateSlider = (index: number) => {
    const btn = btnRefs.current[index]
    const slider = sliderRef.current
    if (!btn || !slider) return
    slider.style.transform = `translateX(calc(${100 * index}% + ${2 * index}px))`
  }

  useEffect(() => {
    const index = tabs.findIndex(t => t.value === value)
    if (index !== -1) updateSlider(index)
  }, [value, tabs])

  const handleClick = (tab: Tab, index: number) => {
    onChange(tab.value)
    updateSlider(index)
  }

  return (
    <div className={stl.tabs} ref={wrapRef} style={{'--i': tabs.length} as React.CSSProperties}>
      <div className={stl.tabs__slider} ref={sliderRef}/>
      {tabs.map((tab, i) => (
        <button
          key={tab.value}
          ref={el => {
            btnRefs.current[i] = el
          }}
          className={`${stl.tabs__tab} ${value === tab.value ? stl.tabs__tab_active : ''}`}
          onClick={() => handleClick(tab, i)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
