import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'

export default function PreviewPane({ markdown }: { markdown: string }) {
    return (
        <>
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
            >
                {markdown}
            </ReactMarkdown>
        </>
    )
}
