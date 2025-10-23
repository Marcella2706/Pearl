export function TypographyP({text,className}:{
    text:string;
    className?:string;
}) {
  return (
    <h1 className={`leading-7 not-first:mt-6 ${className ? ` ${className}` : ""}`}>
        {text}
    </h1>
  )
}
