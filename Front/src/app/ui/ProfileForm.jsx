"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/Button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/ui/form"
import { Input } from "@/app/ui/input"
import { Textarea } from "@/app/ui/textarea"


const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
})

export function ProfileForm() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
    },
  });
  
  const onSubmit = data => {
    console.log(data);
  };
  

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Auteur</FormLabel>
              <FormControl>
                <Input placeholder="Écrire le nom de l'auteur" {...field} />
              </FormControl>
              <FormLabel>Livre</FormLabel>
              <FormControl>
                <Input placeholder="Écrire le titre du livre" {...field} />
              </FormControl>
              <FormLabel>Date</FormLabel>
              <FormControl>
                <Input placeholder="Écrire le titre du livre" {...field} />
              </FormControl>
              <FormLabel>Phrase</FormLabel>
              <FormControl>
              <Textarea placeholder="Écrire ton citation" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-evenly">
        <Button type="submit" variant="default">Ajouter</Button>
        <Button type="submit" variant="secondary">Arriére</Button>
        </div>
      </form>
    </Form>
  )
}
