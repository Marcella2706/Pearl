export function TypographyMuted({text,className}:{
    text:string;
    className?:string;
}) {
  return (
    <p className={`text-muted-secondary text-sm`+className? className:""}>{text}</p>
  )
}
