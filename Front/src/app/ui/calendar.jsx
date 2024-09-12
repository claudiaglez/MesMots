import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"
import { fr } from 'date-fns/locale';
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/Button"

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}) {
  return (
    (<DayPicker
      locale={fr}
      showOutsideDays={showOutsideDays}
      className={cn("p-3 bg-lightPink", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium font-lifeSavers font-extrabold",
        nav: "space-x-1 flex items-center",
        nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 flex items-center justify-center",
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell:
          "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem] font-lifeSavers font-extrabold",
        row: "flex w-full mt-2",
        cell: "h-9 w-9 text-center text-sm p-0 relative flex items-center justify-center font-lifeSavers",
        day: cn(
          "h-9 w-9 p-0 font-normal aria-selected:opacity-100 font-lifeSavers",
          "hover:bg-blue hover:text-primary focus:bg-blue focus:text-primary"
        ),
        day_range_end: "day-range-end",
        day_selected:
          "bg-blue text-primary-foreground hover:bg-blue hover:text-primary-foreground focus:bg-blue focus:text-primary-foreground font-lifeSavers",
        day_today: "bg-cream text-accent-foreground font-lifeSavers",
        day_outside:
          "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30 font-lifeSavers",
        day_disabled: "text-muted-foreground opacity-50 font-lifeSavers",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground font-lifeSavers",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4" />,
        IconRight: ({ ...props }) => <ChevronRight className="h-4 w-4" />,
      }}
      {...props} />)
  );
}
Calendar.displayName = "Calendar"

export { Calendar }
