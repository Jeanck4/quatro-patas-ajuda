
/**
 * use-toast.ts
 * 
 * Arquivo de utilitário que re-exporta o hook useToast e a função toast
 * do diretório de hooks, permitindo um acesso mais conveniente a estas
 * funcionalidades em toda a aplicação.
 */

// Re-export from the hooks directory
import { useToast, toast } from "@/hooks/use-toast";

export { useToast, toast };
