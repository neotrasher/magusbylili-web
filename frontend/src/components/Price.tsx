export default function Price({ value, className="" }:{ value:number; className?:string }) {
  return <span className={className}>$ {value.toLocaleString('es-CO')}</span>;
}
