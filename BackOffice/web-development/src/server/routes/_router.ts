
import userRouter from "@/src/server/routes/users/router";
import devicesRouter from "@/src/server/routes/devices/router";
import videosRouter from "@/src/server/routes/videos/router";
import imagesRouter from "@/src/server/routes/images/router";
import PasswordTokenRouter from "@/src/server/routes/users/passwordToken/router";
import {mergeRouters } from "../trpc";
import AIModelsRouter from "@/src/server/routes/ai-models/router";

export const appRouter = mergeRouters(
    userRouter,
    PasswordTokenRouter,
    devicesRouter,
    videosRouter,
    imagesRouter,
    AIModelsRouter
);

export type AppRouter = typeof appRouter;