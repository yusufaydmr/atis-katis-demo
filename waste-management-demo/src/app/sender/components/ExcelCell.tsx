import { cn } from "@/lib/utils"

interface ExcelCellProps {
  label: string;
  children: React.ReactNode;
  className?: string;
  headerClass?: string;
}

export function ExcelCell({ 
  label, 
  children, 
  className,
  headerClass = "bg-gray-50 text-gray-700" 
}: ExcelCellProps) {
  return (
    <div className={cn("flex flex-col h-full border-r border-gray-200 last:border-r-0 bg-white", className)}>
      <div className={cn("w-full px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide border-b border-gray-100 flex-shrink-0", headerClass)}>
        {label}
      </div>
      <div className="flex-1 flex items-center px-3 relative min-h-[40px]">
        {children}
      </div>
    </div>
  )
}