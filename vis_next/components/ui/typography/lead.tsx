export function TypographyLead({text,className}:{
    text:string;
    className?:string;
}) {
  return (
    <p className={`text-muted-secondary text-xl` + (className ? ` ${className}` : "")}>
        {text}
    </p>
  )
}
