import { useEffect, useState } from 'react'
import PreviewPane from '@/components/PreviewPane'
import Toolbar from '@/components/Toolbar'

export default function Editor({ file }: { file: string | null }) {
    const [markdown, setMarkdown] = useState('')

    useEffect(() => {
        if (file) {
            fetch(`/api/files?path=${encodeURIComponent(file)}`)
                .then((res) => res.json())
                .then((data) => setMarkdown(data.content || ''))
        }
    }, [file])

    if (!file) return <p>Select a file to begin editing.</p>

    return (
        <div className="flex flex-col gap-4 h-full">
            <Toolbar file={file} content={markdown} setContent={setMarkdown} />
            <div className="flex flex-1 gap-4">
                <textarea
                    className="w-1/2 h-full border p-2"
                    placeholder="Start typing your markdown here..."
                    value={markdown}
                    onChange={(e) => setMarkdown(e.target.value)}
                />
                <div className="w-1/2 h-full border p-2 overflow-auto">
                    <PreviewPane markdown={markdown} />
                </div>
            </div>
        </div>
    )
}
