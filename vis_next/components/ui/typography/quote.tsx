export function TypographyBlockquote({text,className}:{
    text:string;
    className?:string;
}) {
  return (
    <blockquote className={`mt-6 border-l-2 pl-6 italic`+className?` ${className}`:""}>
      {text}
    </blockquote>
  )
}
