import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

/** Las tablas de normativa suelen ser anchas: van dentro de su propio scroll horizontal. */
const componentes = {
  table: (props: React.ComponentProps<'table'>) => (
    <div className="md-tabla">
      <table {...props} />
    </div>
  ),
  a: (props: React.ComponentProps<'a'>) => <a {...props} target="_blank" rel="noreferrer" />,
}

export default function Markdown({ children }: { children: string }) {
  return (
    <div className="md">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={componentes}>
        {children}
      </ReactMarkdown>
    </div>
  )
}
