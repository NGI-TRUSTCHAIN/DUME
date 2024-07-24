import dynamic from "next/dynamic";

export const DynamicMap = dynamic(() => import('@/components/maps/map-videos'), {
    ssr: false
});