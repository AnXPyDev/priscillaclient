// @ts-ignore
import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
    resolve : {
      alias: {
        '@': resolve('src/main'),
        '@shared': resolve('src/shared'),
        '@root': resolve('src/')
      }
    }
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
    resolve : {
      alias: {
        '@': resolve('src'),
        '@shared': resolve('src/shared'),
        '@root': resolve('src/')
      }
    }
  },
  renderer: {
    resolve: {
      alias: {
        '@': resolve('src/renderer/src'),
        '@shared': resolve('src/shared'),
        '@root': resolve('src/')
      }
    },
    plugins: [vue()]
  }
})
