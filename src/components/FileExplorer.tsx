import { useEffect, useState } from 'react'

type FileEntry = {
    name: string
    type: 'file' | 'directory'
}

function FileNode({
    path,
    name,
    type,
    selectedFile,
    onSelect,
    refresh,
}: {
    path: string
    name: string
    type: 'file' | 'directory'
    selectedFile: string | null
    onSelect: (path: string) => void
    refresh: () => void
}) {
    const [expanded, setExpanded] = useState(false)
    const [children, setChildren] = useState<FileEntry[]>([])

    const loadChildren = async () => {
        const res = await fetch(`/api/files?path=${encodeURIComponent(path)}`)
        const data = await res.json()
        setChildren(data.files)
    }

    const toggle = async () => {
        if (type === 'directory') {
            if (!expanded) await loadChildren()
            setExpanded(!expanded)
        } else {
            onSelect(path)
        }
    }

    const createFile = async () => {
        const filename = prompt('Enter new file name (e.g. file.md)')
        if (!filename) return

        await fetch(
            `/api/files?path=${encodeURIComponent(path + '/' + filename)}`,
            {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isDirectory: false }),
            }
        )

        await loadChildren()
        setExpanded(true)
    }

    const createFolder = async () => {
        const folderName = prompt('Enter new folder name:')
        if (!folderName) return

        await fetch(
            `/api/files?path=${encodeURIComponent(path + '/' + folderName)}`,
            {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isDirectory: true }),
            }
        )

        await loadChildren()
        setExpanded(true)
    }

    const deleteEntry = async () => {
        const confirmed = confirm(`Delete "${name}"?`)
        if (!confirmed) return

        await fetch(`/api/files?path=${encodeURIComponent(path)}`, {
            method: 'DELETE',
        })

        refresh()
    }

    return (
        <div>
            <div
                className={`cursor-pointer select-none hover:underline flex items-center justify-between ${
                    selectedFile === path ? 'font-bold text-blue-600' : ''
                }`}
            >
                <span onClick={toggle}>
                    {type === 'directory' ? (expanded ? '📂' : '📁') : '📄'}{' '}
                    {name}
                </span>
                <button
                    onClick={deleteEntry}
                    className="text-red-500 text-xs ml-2"
                >
                    🗑️
                </button>
            </div>

            {expanded && type === 'directory' && (
                <div className="ml-4 space-y-1">
                    <button
                        onClick={createFile}
                        className="text-green-600 text-xs hover:underline mr-2"
                    >
                        + File
                    </button>
                    <button
                        onClick={createFolder}
                        className="text-yellow-600 text-xs hover:underline"
                    >
                        + Folder
                    </button>
                    {children.map((child) => (
                        <FileNode
                            key={child.name}
                            path={`${path}/${child.name}`}
                            name={child.name}
                            type={child.type}
                            selectedFile={selectedFile}
                            onSelect={onSelect}
                            refresh={loadChildren}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}

export default function FileExplorer({
    onSelect,
}: {
    onSelect: (file: string) => void
}) {
    const [files, setFiles] = useState<FileEntry[]>([])
    const [selected, setSelected] = useState<string | null>(null)

    const loadRoot = () => {
        fetch('/api/files?path=.')
            .then((res) => res.json())
            .then((data) => setFiles(data.files))
    }

    useEffect(loadRoot, [])

    return (
        <ul className="space-y-1 text-sm">
            {files.map((file) => (
                <li key={file.name}>
                    <FileNode
                        path={file.name}
                        name={file.name}
                        type={file.type}
                        selectedFile={selected}
                        onSelect={(f) => {
                            setSelected(f)
                            onSelect(f)
                        }}
                        refresh={loadRoot}
                    />
                </li>
            ))}
        </ul>
    )
}
