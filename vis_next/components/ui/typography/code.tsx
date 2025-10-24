export function TypographyInlineCode(text:string,className?:string) {
  return (
    <code className={`bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold`+ (className ? ` ${className}` : "")}>
      {text}
    </code>
  )
}
