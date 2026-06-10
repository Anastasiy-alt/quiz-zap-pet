'use client'
import Button from "@/components/ui/button";
import {useRouter} from 'next/navigation'

export default function BackBtn() {
  const router = useRouter()

  function goBack() {
    window.scrollTo({top: 0, behavior: 'smooth'})
    if (window.history.length <= 1) {
      router.push('/')
    } else {
      router.back()
    }
  }

  return (
    <Button text={'назад'} type={'tx'} action={goBack}>
      <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor">
        <path d="M400-80 0-480l400-400 71 71-329 329 329 329-71 71Z"/>
      </svg>
    </Button>
  )
}
