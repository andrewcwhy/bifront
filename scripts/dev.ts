import http from 'http'
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
import { fileURLToPath } from 'url'

// ESM-style __dirname workaround
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const ROOT_DIR = process.cwd()
const PUBLIC_DIR = path.join(__dirname, '../dist')
const PORT = 3001

const server = http.createServer(async (req, res) => {
    const url = new URL(req.url || '/', `http://${req.headers.host}`)
    const pathname = decodeURIComponent(url.pathname)
    const queryPath = decodeURIComponent(url.searchParams.get('path') || '')
    const fullPath = path.join(ROOT_DIR, queryPath)

    if (pathname.startsWith('/api/files')) {
        try {
            if (req.method === 'GET') {
                const fileStat = await stat(fullPath)
                if (fileStat.isDirectory()) {
                    const entries = await readdir(fullPath, { withFileTypes: true })
                    const files = entries.map((entry) => ({
                        name: entry.name,
                        type: entry.isDirectory() ? 'directory' : 'file',
                    }))
                    return sendJson(res, 200, { files })
                } else {
                    const content = await readFile(fullPath, 'utf8')
                    return sendJson(res, 200, { content })
                }
            }

            let body = ''
            req.on('data', chunk => { body += chunk })
            req.on('end', async () => {
                let json: any = {}
                try {
                    json = JSON.parse(body)
                } catch {}

                if (req.method === 'POST') {
                    await writeFile(fullPath, json.content || '', 'utf8')
                    return res.end('Saved')
                }

                if (req.method === 'PUT') {
                    if (json.isDirectory) {
                        await mkdir(fullPath, { recursive: true })
                    } else {
                        await writeFile(fullPath, '', 'utf8')
                    }
                    return res.end('Created')
                }

                if (req.method === 'DELETE') {
                    const fileStat = await stat(fullPath)
                    if (fileStat.isDirectory()) {
                        await rm(fullPath, { recursive: true })
                    } else {
                        await unlink(fullPath)
                    }
                    return res.end('Deleted')
                }

                if (req.method === 'PATCH') {
                    const newFullPath = path.join(ROOT_DIR, json.newPath)
                    await rename(fullPath, newFullPath)
                    return res.end('Renamed')
                }
            })

            return
        } catch (err) {
            console.error('❌ File API error:', err)
            res.writeHead(500)
            return res.end('File operation failed')
        }
    }

    const filePath = path.join(PUBLIC_DIR, pathname === '/' ? 'index.html' : pathname)

    try {
        const fileBuffer = await readFile(filePath)
        const ext = path.extname(filePath)
        const contentType = getContentType(ext)
        res.writeHead(200, { 'Content-Type': contentType || 'application/octet-stream' })
        return res.end(fileBuffer)
    } catch {
        try {
            const fallback = await readFile(path.join(PUBLIC_DIR, 'index.html'))
            res.writeHead(200, { 'Content-Type': 'text/html' })
            res.end(fallback)
        } catch {
            res.writeHead(404)
            res.end('Not Found')
        }
    }
})

server.listen(PORT, () => {
    console.log(`Janudocs Editor running at http://localhost:${PORT}`)
})

process.on('SIGINT', () => {
    console.log('\nJanudocs Editor stopped by user.')
    process.exit(0)
})

function sendJson(res: http.ServerResponse, status: number, data: any) {
    res.writeHead(status, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify(data))
}

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
