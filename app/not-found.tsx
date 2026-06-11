import Link from 'next/link'
import stl from './globals.module.sass'
import Button from "@/components/ui/button";

export default function NotFound() {

    return (
        <div className={stl.notFound}>
            <div className={stl.notFound__icon}>
              😶
            </div>
            <h1 className={stl.notFound__title}>Темно. Пусто. Тихо.</h1>
            <p className={stl.notFound__sub}>Страница ушла и не вернулась. Как знания после каникул.</p>
           <Button type={"pr"} text={'На главную'} link={'/'} />
        </div>
    )
}
