import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Card, CardContent, CardDescription,
    CardFooter, CardHeader, CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select, SelectContent, SelectItem,
    SelectTrigger, SelectValue
} from "@/components/ui/select";
import { UserPlus } from "lucide-react";
import api from "@/services/api";

export default function FormAddUser() {
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [permissao, setPermissao] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!nome || !email || !senha || !permissao) {
            alert("Preencha todos os campos.");
            return;
        }

        if (senha.length < 6) {
            alert("A senha deve ter no mínimo 6 caracteres.");
            return;
        }

        setIsSubmitting(true);
        try {
            await api.post("/registrar", { nome, email, senha, permissao });
            alert("Usuário cadastrado com sucesso!");
            setNome("");
            setEmail("");
            setSenha("");
            setPermissao("");
        } catch (error: any) {
            const msg = error.response?.data || "Erro ao cadastrar usuário.";
            alert(msg);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Cadastrar Novo Usuário</CardTitle>
                <CardDescription>
                    Adicione novos usuários ao sistema com as permissões adequadas
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="nome">Nome Completo</Label>
                    <Input
                        id="nome"
                        placeholder="Nome do usuário"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="email">E-mail</Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="usuario@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="senha">Senha</Label>
                    <Input
                        id="senha"
                        type="password"
                        placeholder="Mínimo 6 caracteres"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="permissao">Permissão</Label>
                    <Select value={permissao} onValueChange={setPermissao}>
                        <SelectTrigger id="permissao" className="w-full">
                            <SelectValue placeholder="Selecione a permissão" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ROLE_ADMIN">Administrador</SelectItem>
                            <SelectItem value="ROLE_TECNICO">Técnico</SelectItem>
                            <SelectItem value="ROLE_ESTOQUISTA">Estoquista</SelectItem>
                            <SelectItem value="ROLE_SUPERVISOR">Supervisor</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </CardContent>

            <CardFooter>
                <Button
                    variant="blue"
                    className="w-full text-white"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                >
                    <UserPlus className="w-4 h-4 mr-2" />
                    {isSubmitting ? "Cadastrando..." : "Cadastrar Usuário"}
                </Button>
            </CardFooter>
        </Card>
    );
}