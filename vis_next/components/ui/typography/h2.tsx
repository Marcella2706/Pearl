export function TypographyH2({text,className}:{
    text:string;
    className?:string;
}) {
  return (
    <h1 className={`scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 ${className ? ` ${className}` : ""}`}>
        {text}
    </h1>
  )
}
