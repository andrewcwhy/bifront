#!/usr/bin/env bun
import { build } from 'bun'
import plugin from 'bun-plugin-tailwind'
import { rm, cp } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'

// Constants
const outdir = 'dist'
const publicHtml = path.resolve('public/index.html')
const distHtml = path.resolve(outdir, 'index.html')

console.log('\n🚀 Building janudocs-editor...')

// Clean old build
if (existsSync(outdir)) {
    console.log(`🧹 Cleaning previous build at ${outdir}`)
    await rm(outdir, { recursive: true, force: true })
}

// Run Bun build with Tailwind plugin
await build({
    entrypoints: ['src/main.tsx'],
    plugins: [plugin],
    outdir,
    target: 'browser',
})

console.log(`✅ JS built to ${outdir}/main.js`)

// Copy public/index.html → dist/index.html
if (existsSync(publicHtml)) {
    try {
        await cp(publicHtml, distHtml)
        console.log(`📄 Copied index.html to ${distHtml}`)
    } catch (err) {
        console.warn('⚠️ Could not copy index.html:', err)
    }
} else {
    console.warn('⚠️ Skipped: public/index.html does not exist.')
}
