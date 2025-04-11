#!/usr/bin/env node
import { spawn } from 'child_process'
import { fileURLToPath } from 'url'
import path from 'path'

// Importing the Bun runtime to run the server
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Path to the server file
const serverPath = path.join(__dirname, '../scripts/dev.ts')

// Spawn the server process using Bun
spawn('bun', [serverPath], {
    stdio: 'inherit',
    cwd: process.cwd(),
})
