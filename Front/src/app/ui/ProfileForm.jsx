import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/Button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/ui/form";
import { Input } from "@/app/ui/input";
import { Textarea } from "@/app/ui/textarea";
import { DatePickerDemo } from "./DatePicker";

const formSchema = z.object({
  auteur: z.string().min(2, { message: "L'auteur doit contenir au moins 2 caractères." }),
  livre: z.string().min(2, { message: "Le titre du livre doit contenir au moins 2 caractères." }),
  date: z.date().optional(), 
  phrase: z.string().min(5, { message: "La citation doit contenir au moins 5 caractères." }),
});


export function ProfileForm() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      auteur: "",
      livre: "",
      date: null,
      phrase: "",
    },
  });

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="auteur"
          render={({ field }) => (
            <FormItem className="space-y-4">
              <div>
                <FormLabel className="font-lifeSavers font-extrabold text-lg">Auteur/ice</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Écrire le nom de l'auteur"
                    {...field}
                    className="w-full font-lifeSavers mt-3 bg-lightPink"
                  />
                </FormControl>
              </div>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="livre"
          render={({ field }) => (
            <FormItem className="space-y-4">
              <div>
                <FormLabel className="font-lifeSavers font-extrabold text-lg">Livre</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Écrire le titre du livre"
                    {...field}
                    className="w-full font-lifeSavers mt-3 bg-lightPink"
                  />
                </FormControl>
              </div>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="space-y-4">
              <div className="flex flex-col items-center">
                <FormLabel className="font-lifeSavers font-extrabold text-lg">Date </FormLabel>
                <FormControl>
                  <DatePickerDemo {...field} className="w-full font-lifeSavers text-center" />
                </FormControl>
              </div>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phrase"
          render={({ field }) => (
            <FormItem className="space-y-4">
              <div>
                <FormLabel className="font-lifeSavers font-extrabold text-lg">Phrase</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Écrire ta citation"
                    {...field}
                    className="w-full font-lifeSavers mt-3 bg-lightPink"
                  />
                </FormControl>
              </div>
            </FormItem>
          )}
        />
        <FormMessage />
        <div className="flex justify-evenly">
          <Button type="submit" variant="default">
            Ajouter
          </Button>
          <Button type="submit" variant="secondary">
            Arrière
          </Button>
        </div>
      </form>
    </Form>
  );
}
