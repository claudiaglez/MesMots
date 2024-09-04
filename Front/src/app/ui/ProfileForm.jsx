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
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
});

export function ProfileForm() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
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
          name="username"
          render={({ field }) => (
            <FormItem className="space-y-4">
              <div>
                <FormLabel>Auteur</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Écrire le nom de l'auteur"
                    {...field}
                    className="w-full"
                  />
                </FormControl>
              </div>
              <div>
                <FormLabel>Livre</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Écrire le titre du livre"
                    {...field}
                    className="w-full"
                  />
                </FormControl>
              </div>
              <div>
                <FormLabel>Date </FormLabel>
                <FormControl>
                  <DatePickerDemo className="w-full" />
                </FormControl>
              </div>
              <div>
                <FormLabel>Phrase</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Écrire ton citation"
                    {...field}
                    className="w-full"
                  />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-evenly">
          <Button type="submit" variant="default">
            Ajouter
          </Button>
          <Button type="submit" variant="secondary">
            Arriére
          </Button>
        </div>
      </form>
    </Form>
  );
}
