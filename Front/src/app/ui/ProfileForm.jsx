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

const formSchema = z.object({
  auteur: z.string().min(2, { message: "L'auteur doit contenir au moins 2 caractères." }),
  livre: z.string().min(2, { message: "Le titre du livre doit contenir au moins 2 caractères." }),
  // Eliminar el campo de fecha de aquí
  phrase: z.string().min(5, { message: "La citation doit contenir au moins 5 caractères." }),
});

export function ProfileForm() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      auteur: "",
      livre: "",
      phrase: "",
    },
  });

  const onSubmit = async (data) => {
    const formattedData = {
      author: data.auteur,
      title: data.livre,
      phrase: data.phrase,
      
    };

    console.log('Datos enviados:', formattedData); // Depuración

    try {
      const response = await fetch('http://127.0.0.1:8000/api/quotes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedData), // Envía los datos como JSON
      });
  
      if (!response.ok) {
        throw new Error('Error en la solicitud');
      }
  
      const result = await response.json();
      console.log('Datos enviados con éxito:', result); // Verifica la respuesta
    } catch (error) {
      console.error('Error al enviar los datos:', error);
    }
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
                <FormLabel className="font-lifeSavers font-extrabold text-lg text-lightPink">Auteur/ice</FormLabel>
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
                <FormLabel className="font-lifeSavers font-extrabold text-lg text-lightPink">Livre</FormLabel>
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
        {/* Eliminar el campo de fecha de aquí */}
        <FormField
          control={form.control}
          name="phrase"
          render={({ field }) => (
            <FormItem className="space-y-4">
              <div>
                <FormLabel className="font-lifeSavers font-extrabold text-lg text-lightPink">Phrase</FormLabel>
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
          <Button type="button" variant="secondary" onClick={() => form.reset()}>
            Arrière
          </Button>
        </div>
      </form>
    </Form>
  );
}



