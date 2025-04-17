import Button from '@/components/ui/Button'

export default function Toolbar({
    file,
    content,
    setContent,
}: {
    file: string
    content: string
    setContent: (s: string) => void
}) {
    const save = async () => {
        await fetch(`/api/files?path=${encodeURIComponent(file)}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content }),
        })
        alert('✅ File saved!')
    }

    const del = async () => {
        if (confirm('Are you sure you want to delete this file?')) {
            await fetch(`/api/files?path=${encodeURIComponent(file)}`, {
                method: 'DELETE',
            })
            location.reload()
        }
    }

    const rename = async () => {
        const newName = prompt('Enter new name:')
        if (!newName) return

        const newPath = file.split('/').slice(0, -1).concat(newName).join('/')
        await fetch(`/api/files?path=${encodeURIComponent(file)}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ newPath }),
        })
        location.reload()
    }

    const create = async () => {
        const name = prompt('Enter name for new .md file:')
        if (!name?.endsWith('.md')) return alert('Must end with .md')

        await fetch(`/api/files?path=${encodeURIComponent(name)}`, {
            method: 'PUT',
        })
        location.reload()
    }

    return (
        <div className="flex gap-2 mb-2">
            <Button variant="primary" onClick={save}>
                Save
            </Button>
            <Button variant="warning" onClick={rename}>
                Rename
            </Button>
            <Button variant="success" onClick={create}>
                New File
            </Button>
            <Button variant="danger" onClick={del}>
                Delete
            </Button>
        </div>
    )
}
