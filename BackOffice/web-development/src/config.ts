import {LogLevel} from "@/src/lib/logger";
import {getSiteURL} from "@/src/lib/get-site-url";


export interface Config {
    site: { name: string; description: string; themeColor: string; url: string };
    logLevel: keyof typeof LogLevel;
}

export const config: Config = {
    site: { name: 'Theia Vision Dashboard', description: '', themeColor: '#090a0b', url: getSiteURL() },
    logLevel: (process.env.NEXT_PUBLIC_LOG_LEVEL as keyof typeof LogLevel) ?? LogLevel.ALL,
};