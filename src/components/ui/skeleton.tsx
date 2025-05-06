import { cn } from "@/lib/utils"

/**
 * skeleton.tsx
 * 
 * Componente para criar indicadores de carregamento no formato do conteúdo
 * que será exibido. Melhora a experiência do usuário ao:
 * - Mostrar uma prévia da estrutura do conteúdo durante carregamento
 * - Reduzir a percepção de lentidão
 * - Evitar mudanças bruscas de layout quando o conteúdo é carregado
 */

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  )
}

export { Skeleton }
