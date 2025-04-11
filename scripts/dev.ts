import { serve } from 'bun'
import {
    stat,
    readdir,
    unlink,
    writeFile,
    mkdir,
    rename,
    rm,
    readFile,
} from 'node:fs/promises'
import path from 'path'

// Constants
const ROOT_DIR: string = process.cwd()
const PUBLIC_DIR: string = path.join(import.meta.dir, '../dist')
const PORT: number = 3001

serve({
    port: PORT,
    async fetch(req) {
        const url = new URL(req.url)
        const pathname = decodeURIComponent(url.pathname)
        const queryPath = decodeURIComponent(url.searchParams.get('path') || '')
        const fullPath = path.join(ROOT_DIR, queryPath)

        // 📁 File API
        if (pathname.startsWith('/api/files')) {
            try {
                // Read file or directory
                if (req.method === 'GET') {
                    const fileStat = await stat(fullPath)

                    if (fileStat.isDirectory()) {
                        const entries = await readdir(fullPath, {
                            withFileTypes: true,
                        })
                        const files = entries.map((entry) => ({
                            name: entry.name,
                            type: entry.isDirectory() ? 'directory' : 'file',
                        }))
                        return Response.json({ files })
                    } else {
                        const content = await readFile(fullPath, 'utf8')
                        return Response.json({ content })
                    }
                }

                // Save file contents
                if (req.method === 'POST') {
                    const { content } = await req.json()
                    await writeFile(fullPath, content || '', 'utf8')
                    return new Response('Saved')
                }

                // Create file or folder
                if (req.method === 'PUT') {
                    const body = await req.json().catch(() => ({}))
                    if (body.isDirectory) {
                        await mkdir(fullPath, { recursive: true })
                    } else {
                        await writeFile(fullPath, '', 'utf8')
                    }
                    return new Response('Created')
                }

                // Delete file or folder
                if (req.method === 'DELETE') {
                    const fileStat = await stat(fullPath)
                    if (fileStat.isDirectory()) {
                        await rm(fullPath, { recursive: true })
                    } else {
                        await unlink(fullPath)
                    }
                    return new Response('Deleted')
                }

                // Rename file or folder
                if (req.method === 'PATCH') {
                    const { newPath } = await req.json()
                    const newFullPath = path.join(ROOT_DIR, newPath)
                    await rename(fullPath, newFullPath)
                    return new Response('Renamed')
                }
            } catch (err) {
                console.error('❌ File API error:', err)
                return new Response('File operation failed', { status: 500 })
            }
        }

        // Static file serving
        const filePath = path.join(
            PUBLIC_DIR,
            pathname === '/' ? 'index.html' : pathname
        )
        const file = Bun.file(filePath)

        if (await file.exists()) {
            const ext = path.extname(filePath)
            const contentType = getContentType(ext)
            return new Response(
                file,
                contentType
                    ? { headers: { 'Content-Type': contentType } }
                    : undefined
            )
        }

        // Fallback to SPA routing (React)
        const fallback = Bun.file(path.join(PUBLIC_DIR, 'index.html'))
        return new Response(fallback, {
            headers: { 'Content-Type': 'text/html' },
        })
    },
})

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\nJanudocs Editor stopped by user.')
    process.exit(0)
})

// Log server start
console.log(`Janudocs Editor running at http://localhost:${PORT}`)

// Helper function to get content type based on file extension
function getContentType(ext: string): string | undefined {
    return {
        '.js': 'application/javascript',
        '.css': 'text/css',
        '.html': 'text/html',
        '.json': 'application/json',
        '.png': 'image/png',
        '.svg': 'image/svg+xml',
        '.md': 'text/markdown',
    }[ext]
}
