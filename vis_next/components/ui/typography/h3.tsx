export function TypographyH3({text,className}:{
    text:string;
    className?:string;
}) {
  return (
    <h1 className={`scroll-m-20 text-2xl font-semibold tracking-tight ${className ? ` ${className}` : ""}`}>
        {text}
    </h1>
  )
}
