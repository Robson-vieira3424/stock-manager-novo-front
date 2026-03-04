import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useFieldArray, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash } from "lucide-react"
import { useState } from "react"
import api from "@/services/api";

interface FormDepartamentoProps {
    secretariaId: string;
    onClose: () => void;
    onSuccess: () => void; // Para recarregar a página após salvar
}

export default function FormDepartamento({ secretariaId, onClose, onSuccess }: FormDepartamentoProps) {
    const [isLoading, setIsLoading] = useState(false);

    const formSchema = z.object({
        departamentos: z.array(
            z.object({
                nome: z.string().min(1, { message: "O nome do departamento é obrigatório." })
            })
        ).min(1, { message: "Adicione pelo menos um departamento." })
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            departamentos: [{ nome: "" }]
        },
    })

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "departamentos",
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);
        try {
            const payload = values.departamentos;

            await api.post(`/secretaria/${secretariaId}/departamentos`, payload);

            alert("Departamento(s) adicionado(s) com sucesso!");
            onSuccess(); 
        } catch (error) {
            console.error("Erro na requisição:", error);
            alert("Não foi possível salvar o(s) departamento(s).");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Card className="min-w-[450px]">
            <CardHeader>
                <CardTitle>Novo Departamento</CardTitle>
                <CardDescription>
                    Adicione novos departamentos a esta secretaria.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form id="departamento-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between pb-2">
                                <FormLabel className="text-base">Departamentos</FormLabel>
                                <Button
                                    type="button" variant="outline" size="sm" className="flex gap-2"
                                    onClick={() => append({ nome: "" })}
                                >
                                    <Plus className="h-4 w-4" /> Adicionar Mais
                                </Button>
                            </div>

                            <div className="space-y-3">
                                {fields.map((field, index) => (
                                    <FormField
                                        key={field.id}
                                        control={form.control}
                                        name={`departamentos.${index}.nome`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <div className="flex items-center gap-2">
                                                    <FormControl>
                                                        <Input placeholder={`Nome do Departamento ${index + 1}`} {...field} />
                                                    </FormControl>
                                                    <Button
                                                        type="button" variant="ghost" size="icon"
                                                        className="text-destructive hover:bg-destructive/10"
                                                        onClick={() => remove(index)}
                                                        disabled={fields.length === 1}
                                                    >
                                                        <Trash className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                ))}
                            </div>
                        </div>
                    </form>
                </Form>
            </CardContent>
            <CardFooter className="flex gap-2 justify-end">
                <Button variant="outline" onClick={onClose} disabled={isLoading}>Cancelar</Button>
                <Button type="submit" variant="blue" form="departamento-form" disabled={isLoading}>
                    {isLoading ? "Salvando..." : "Salvar"}
                </Button>
            </CardFooter>
        </Card>
    )
}