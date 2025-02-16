import React from "react";
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
        <form lang="fr" onSubmit={form.handleSubmit(onSubmit)} className="space-y-8" aria-label="Formulaire d'ajout de citation">
          <FormField
            control={form.control}
            name="auteur"
            render={({ field }) => (
              <FormItem className="space-y-4">
                <div>
                  <FormLabel 
                  htmlFor="auteur"
                  className="font-lifeSavers font-extrabold text-lg text-lightPink">Auteur/ice
                  </FormLabel>
                  <FormControl>
                    <Input
                      id="auteur"
                      placeholder="Écrire le nom de l'auteur"
                      {...field}
                      className="w-full font-lifeSavers mt-3 bg-lightPink"
                      aria-invalid={form.formState.errors.auteur ? "true" : "false"}
                      aria-describedby="auteur-error"
                    />
                  </FormControl>
                </div>
                <FormMessage id="auteur-error" role="alert" aria-live="assertive" message={form.formState.errors.auteur?.message} />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="livre"
            render={({ field }) => (
              <FormItem className="space-y-4">
                <div>
                  <FormLabel 
                  htmlFor="livre" 
                  className="font-lifeSavers font-extrabold text-lg text-lightPink">Livre
                  </FormLabel>
                  <FormControl>
                    <Input
                      id="livre"
                      placeholder="Écrire le titre du livre"
                      {...field}
                      className={`w-full font-lifeSavers mt-3 bg-lightPink ${form.formState.errors.livre ? 'border-red-500' : ''}`}
                      aria-invalid={form.formState.errors.livre ? "true" : "false"}
                      aria-describedby="livre-error"
                    />
                  </FormControl>
                </div>
                <FormMessage id="livre-error" role="alert" aria-live="assertive" message={form.formState.errors.livre?.message} />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phrase"
            render={({ field }) => (
              <FormItem className="space-y-4">
                <div>
                  <FormLabel 
                  htmlFor="phrase" 
                  className="font-lifeSavers font-extrabold text-lg text-lightPink">Phrase
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      id="phrase"
                      placeholder="Écrire ton phrase"
                      {...field}
                      className={`w-full font-lifeSavers mt-3 bg-lightPink ${form.formState.errors.phrase ? 'border-red-500' : ''}`}
                      aria-invalid={form.formState.errors.phrase ? "true" : "false"}
                      aria-describedby="phrase-error"
                    />
                  </FormControl>
                </div>
                <FormMessage id="phrase-error" role="alert" aria-live="assertive" message={form.formState.errors.phrase?.message} />
              </FormItem>
            )}
          />
          <div className="flex justify-evenly">
            <Button type="submit" variant="default" aria-label="Ajouter une citation">
              Ajouter
            </Button>
            <Button type="reset" variant="secondary" onClick={() => form.reset()} aria-label="Réinitialiser le formulaire">
              Arrière
            </Button>
          </div>
        </form>
      </Form>

      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} role="alertdialog">
        <AlertDialogContent className="bg-cream font-lifeSavers font-bold text-black rounded-lg shadow-lg p-6 " aria-live="polite">
          <AlertDialogHeader>
            <AlertDialogDescription className="text-xl">{dialogMessage}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button variant="default" onClick={handleDialogClose} aria-label="Fermer l'alerte"> 
              Ok
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

