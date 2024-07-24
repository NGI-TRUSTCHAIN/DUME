import { AppRouter } from '@/src/server/routes/_router';
import {createTRPCReact} from '@trpc/react-query';



export const trpc = createTRPCReact<AppRouter>();