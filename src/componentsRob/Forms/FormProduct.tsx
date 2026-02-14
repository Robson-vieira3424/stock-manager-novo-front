import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod"
import api from "../../services/api"

interface FormProps {
    onClose: () => void;
}
const formSchema = z.object({
    name: z.string().min(6, {
        message: "O nome do Item deve ter pelo menos 6 caracteres.",
    }),
    tipoProduto: z.string().min(1, {
        message: "Selecione um tipo de produto válido.",
    }),
    quantity: z.coerce.number().min(0, {
        message: "A quantidade mínima cadastrável de um produto é 0.",
    }),
    min: z.coerce.number().min(1, {
        message: "A quantidade mínima é 0.",
    }),

})

export default function FormProduct({ onClose }: FormProps) {

    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            tipoProduto: "",
            quantity: 0,
            min: 1,
        },
    })

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setIsLoading(true);
        try {
            const payload = {
                name: values.name,
                tipoProduto: values.tipoProduto,
                quantity: values.quantity,
                min: values.min
            }
            const response = await api.post("/product", payload);
         
            console.log("Produto criado:", response.data);
        }
        catch (error) {
            console.error("Erro na requisição:", error);
            alert("Não foi possível salvar o produto.");
        } finally {
            setIsLoading(false);
            onClose();
        }
    }

    return (
        <Card className="min-w-[450px]">
            <CardHeader>
                <CardTitle className="text-[20px]">
                    Adicionar Item ao Estoque
                </CardTitle>

            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form id="product-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nome do Item</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Ex: Toner HP 1102" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="w-full flex flex-nowrap justify-between flex-col gap-2">
                            <FormField
                                control={form.control}
                                name="tipoProduto"
                                render={({ field }) => (
                                    <FormItem >
                                        <FormLabel>Tipo de Item</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Selecione o tipo do Item" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="PLACA_MAE">Placa Mãe</SelectItem>
                                                <SelectItem value="PROCESSADOR">Processador</SelectItem>
                                                <SelectItem value="SSD">SSD</SelectItem>
                                                <SelectItem value="HD">HD</SelectItem>
                                                <SelectItem value="PERIFERICO">Periférico</SelectItem>
                                                <SelectItem value="MEMORIA">Memória Ram</SelectItem>
                                                <SelectItem value="GABINETE">Gabinete</SelectItem>
                                                <SelectItem value="TONER">Toner</SelectItem>
                                                <SelectItem value="OUTROS">Outros</SelectItem>

                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="w-full flex flex-nowrap justify-between">
                            <FormField
                                control={form.control}
                                name="quantity"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Quantidade</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                min={0}
                                                value={field.value ?? ""}
                                                onChange={(e) => field.onChange(Number(e.target.value))}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="min"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Estoque Mínimo</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                min={0}
                                                value={field.value ?? ""}
                                                onChange={(e) => field.onChange(Number(e.target.value))}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                    </form>
                </Form>
            </CardContent>
            <CardFooter className="flex gap-2 justify-between w-full items-center">

                <Button variant="outline" className="w-[46%] hover:cursor-pointer" onClick={onClose}>
                    Cancelar
                </Button>
                <Button type="submit" variant="blue" className="w-[46%] hover:cursor-pointer" form="product-form" disabled={isLoading}>
                    Cadastrar Produto
                </Button>
            </CardFooter>

        </Card >)
}