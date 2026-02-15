import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useFieldArray, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash } from "lucide-react"
import { useState } from "react"
// Importe a sua instância do axios aqui
import api from "@/services/api";

interface FormSecretariaProps {
    onClose: () => void;
}

export default function FormSecretaria({ onClose }: FormSecretariaProps) {

    const [isLoading, setIsLoading] = useState(false);

    const formSchema = z.object({
        secretaria: z.string().min(10, {
            message: "O nome de secretaria deve ter pelo menos 10 caracteres.",
        }),
        departamentos: z.array(
            z.object({
                nome: z.string().min(1, { message: "O nome do departamento é obrigatório." })
            })
        ).min(1, { message: "Adicione pelo menos um departamento." })
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            secretaria: "",
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
            // 1. Transformamos os dados para o formato do Java DTO
            const payload = {
                nome: values.secretaria,
                departamentos: values.departamentos.map(d => d.nome)
            };

            // 2. Chamada usando o Axios (api service)
            // Não precisa de JSON.stringify nem headers manuais
            const response = await api.post("/secretaria", payload);

            // 3. Feedback
            // No axios, o corpo da resposta está em response.data
            console.log("Sucesso:", response.data);
            
            // Se seu backend retorna apenas uma String, o alert vai mostrar ela corretamente
            alert("Secretaria cadastrada com sucesso!"); 
            
            onClose();
        } catch (error) {
            console.error("Erro na requisição:", error);
            alert("Não foi possível salvar a secretaria.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Card className="min-w-[450px]">
            <CardHeader>
                <CardTitle>
                    Nova Secretaria
                </CardTitle>
                <CardDescription>
                    Preencha os dados da nova secretaria e seus departamentos.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form id="secretaria-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        {/* CAMPO: NOME DA SECRETARIA */}
                        <FormField
                            control={form.control}
                            name="secretaria"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nome da Secretaria</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Ex: Secretaria de Saúde" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* SEÇÃO: DEPARTAMENTOS */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between pb-2">
                                <FormLabel className="text-base">Departamentos</FormLabel>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    className="flex gap-2"
                                    onClick={() => append({ nome: "" })}
                                >
                                    <Plus className="h-4 w-4" /> Adicionar
                                </Button>
                            </div>

                            {/* MAPEAMENTO DOS CAMPOS DINÂMICOS */}
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
                                                        <Input
                                                            placeholder={`Departamento ${index + 1}`}
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
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
                <Button variant="outline" onClick={onClose}>
                    Cancelar
                </Button>
                <Button type="submit" variant="blue" form="secretaria-form" disabled={isLoading}>
                    {isLoading ? "Salvando..." : "Criar Secretaria"}
                </Button>
            </CardFooter>
        </Card >
    )
}