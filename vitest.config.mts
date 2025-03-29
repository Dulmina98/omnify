import {defineConfig} from "vitest/config";
import path from 'path';

export default defineConfig({
    test: {
        environment: "edge-runtime",
        server: {deps: {inline: ["convex-test"]}},
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, '.'),
        },
    },
});