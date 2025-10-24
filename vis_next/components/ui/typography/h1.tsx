export function TypographyH1({text,className}:{
    text:string;
    className?:string;
}) {
  return (
    <h1 className={`scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance${className ? ` ${className}` : ""}`}>
        {text}
    </h1>
  )
}
