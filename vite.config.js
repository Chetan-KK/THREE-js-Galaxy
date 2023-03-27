import glsl from 'vite-plugin-glsl';
import { defineConfig } from 'vite';

export default defineConfig({
    base: "/THREE-js-Galaxy/",
    plugins: [glsl()],
    // server: {
    //     origin: 'http://localhost:3000',
    //     host: '0.0.0.0',
    //     fs: {
    //         strict: true,
    //     }
    // }
});