import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { useNavigate } from "react-router-dom"; 

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
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogFooter, AlertDialogDescription } from "@/app/ui/alert-dialog";

const formSchema = z.object({
  auteur: z.string().min(2, { message: "L'auteur doit contenir au moins 2 caractères." }),
  livre: z.string().min(2, { message: "Le titre du livre doit contenir au moins 2 caractères." }),
  phrase: z.string().min(5, { message: "La citation doit contenir au moins 5 caractères." }),
});

export function ProfileForm() {
  const navigate = useNavigate(); 
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");

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

    try {
      const response = await fetch('http://127.0.0.1:8000/api/quotes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedData),
      });

      if (!response.ok) {
        throw new Error('Error en la solicitud');
      }

      const result = await response.json();
      setDialogMessage('Bravo! Citation ajoutée correctement!');
    } catch (error) {
      setDialogMessage("Ooops! Erreur dans l'ajout de la citation");
    } finally {
      setIsDialogOpen(true);
    }
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    navigate("/phrases"); 
  };

  return (
    <>
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
                <FormMessage />
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
                <FormMessage />
              </FormItem>
            )}
          />
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
                <FormMessage />
              </FormItem>
            )}
          />
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

      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent className="bg-cream font-lifeSavers font-bold text-black rounded-lg shadow-lg p-6 ">
          <AlertDialogHeader>
            <AlertDialogDescription className="text-xl">{dialogMessage}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button variant="default" onClick={handleDialogClose}> 
              Ok
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

