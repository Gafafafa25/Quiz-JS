// import { defineConfig } from 'vite'
// import tailwindcss from '@tailwindcss/vite'
// export default defineConfig({
//     plugins: [
//         tailwindcss(),
//     ],
// })

import {defineConfig} from 'vite'

export default defineConfig(async () => {
    const tailwind = (await import('@tailwindcss/vite')).default
    return {
        root: 'public',
        plugins: [tailwind()],
        server: {
            proxy: {
                '/questions': 'http://localhost:3000',
                '/quiz': 'http://localhost:3000',
                '/add': 'http://localhost:3000',
                '/addQuestion': 'http://localhost:3000',
                '/addQuestionRadio': 'http://localhost:3000',
                '/addQuestionCheckbox': 'http://localhost:3000',
                '/addQuestionSelect': 'http://localhost:3000',
                '/addStudent': 'http://localhost:3000',
                '/checkStudent': 'http://localhost:3000',
                '/removeQuestion': 'http://localhost:3000'
            }
        },
        build: {
            outDir: '../dist',
            emptyOutDir: true
        }
    }
})