"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Calendar } from "@/app/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/ui/popover";

export function DatePickerDemo({ value, onChange }) {
  const [date, setDate] = React.useState(value);

  React.useEffect(() => {
    setDate(value);
  }, [value]);

  const handleDateChange = (newDate) => {
    if (newDate instanceof Date) {
      setDate(newDate);
      onChange(newDate); // Notifica al formulario del cambio
    } else {
      console.warn("La fecha seleccionada no es válida:", newDate);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[280px] justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4 text-lightPink" />
          {date ? format(date, "PPP", { locale: fr }) : <span className="text-lightPink">Choisir une date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleDateChange}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}

