import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
import { join, resolve } from 'path'
import {
  bytecodePlugin,
  defineConfig,
  externalizeDepsPlugin
} from 'electron-vite'
import { statSync } from 'fs'

const srcAliases = ['backend', 'frontend', 'common'].map((aliasName) => {
  return {
    find: aliasName,
    replacement: join(__dirname, 'src', aliasName)
  }
})

// only set alias if the proxy-server optional package was not added
try {
  statSync(join(__dirname, 'node_modules', '@hyperplay', 'proxy-server'))
} catch (err) {
  srcAliases.push(
    {
      find: '@hyperplay/providers',
      replacement: join(__dirname, 'src', 'empty.js')
    },
    {
      find: '@hyperplay/proxy-server',
      replacement: join(__dirname, 'src', 'empty.js')
    }
  )
}

const dependenciesToNotExternalize = ['@hyperplay/check-disk-space']

export default defineConfig(({ mode }) => ({
  main: {
    build: {
      rollupOptions: {
        input: 'src/backend/main.ts'
      },
      outDir: 'build/main',
      minify: mode === 'production',
      sourcemap: mode === 'development' ? 'inline' : false
    },
    resolve: { alias: srcAliases },
    plugins: [
      externalizeDepsPlugin({ exclude: dependenciesToNotExternalize }),
      bytecodePlugin()
    ]
  },
  preload: {
    build: {
      rollupOptions: {
        input: [
          'src/backend/preload.ts',
          'src/backend/hyperplay-extension-helper/extensionPreload.ts',
          'src/backend/proxy/providerPreload.ts',
          'src/backend/hyperplay_store_preload.ts',
          'src/backend/webview_style_preload.ts',
          'src/backend/auth_provider_preload.ts'
        ]
      },
      outDir: 'build/preload',
      minify: mode === 'production',
      sourcemap: mode === 'development' ? 'inline' : false
    },
    resolve: { alias: srcAliases },
    plugins: [externalizeDepsPlugin({ exclude: dependenciesToNotExternalize })]
  },
  renderer: {
    root: '.',
    build: {
      rollupOptions: {
        input: resolve('index.html')
      },
      target: 'esnext',
      outDir: 'build',
      emptyOutDir: false,
      minify: mode === 'production',
      sourcemap: mode === 'development' ? 'inline' : false
    },
    resolve: { alias: srcAliases },
    plugins: [svgr(), react()]
  },
  resolve: {
    alias: srcAliases
  },
  plugins: [svgr()]
}))
