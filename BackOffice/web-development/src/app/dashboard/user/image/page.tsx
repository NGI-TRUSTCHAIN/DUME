import dynamic from 'next/dynamic'

const DynamicMap = dynamic(() => import('@/components/maps/map'), {
    ssr: false
});

export default function Page() {
    return (
        <main>
            <DynamicMap />
        </main>
    )
}