import { useState } from "react";
import {
    Card, CardContent, CardDescription,
    CardHeader, CardTitle, CardFooter
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
    Select, SelectContent, SelectItem,
    SelectTrigger, SelectValue
} from "@/components/ui/select";
import {
    Lightbulb, Bug, Sparkles, MoreHorizontal,
    Send, MessageSquarePlus, ImagePlus, X
} from "lucide-react";
import api from "@/services/api";

export default function AddFeedback() {
    const [titulo, setTitulo] = useState("");
    const [descricao, setDescricao] = useState("");
    const [categoria, setCategoria] = useState("");
    const [prioridade, setPrioridade] = useState("");
    const [imagem, setImagem] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Valida tipo
        const tiposPermitidos = ["image/jpeg", "image/png", "image/gif", "image/webp"];
        if (!tiposPermitidos.includes(file.type)) {
            alert("Formato inválido. Use JPG, PNG, GIF ou WEBP.");
            return;
        }

        // Valida tamanho (máx 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert("A imagem deve ter no máximo 5MB.");
            return;
        }

        setImagem(file);
        setPreviewUrl(URL.createObjectURL(file));
    };

    const removerImagem = () => {
        setImagem(null);
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
    };

    const handleSubmit = async () => {
        if (!titulo || !descricao || !categoria || !prioridade) {
            alert("Por favor, preencha todos os campos obrigatórios.");
            return;
        }

        setIsSubmitting(true);

        const formData = new FormData();
        formData.append("titulo", titulo);
        formData.append("descricao", descricao);
        formData.append("categoria", categoria.toUpperCase());
        formData.append("prioridade", prioridade.toUpperCase());
        formData.append("usuarioId", "1");
        if (imagem) {
            formData.append("imagem", imagem);
        }

        try {
            await api.post("/feedbacks", formData, {
                headers: {
                    // Força o Axios a remover o Content-Type padrão (application/json)
                    // deixando o browser setar multipart/form-data; boundary=... automaticamente
                    "Content-Type": undefined,
                },
            });

            alert("Feedback cadastrado com sucesso!");
            setTitulo("");
            setDescricao("");
            setCategoria("");
            setPrioridade("");
            removerImagem();
        } catch (error) {
            console.error("Erro ao enviar feedback:", error);
            alert("Erro ao enviar feedback. Tente novamente.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[28px]">
                    <MessageSquarePlus className="w-5 h-5 text-[#0080FF]" />
                    Novo Feedback
                </CardTitle>
                <CardDescription>
                    Descreva sua sugestão ou problema de forma clara e detalhada.
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">

                {/* Categoria e Prioridade */}
                <section className="flex flex-row w-full gap-4">
                    <div className="flex-1 space-y-2">
                        <Label htmlFor="categoria">Categoria</Label>
                        <Select value={categoria} onValueChange={setCategoria}>
                            <SelectTrigger id="categoria" className="w-full">
                                <SelectValue placeholder="Selecione a categoria" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="sugestao">
                                    <div className="flex items-center gap-2">
                                        <Lightbulb className="w-4 h-4" /><span>Sugestão</span>
                                    </div>
                                </SelectItem>
                                <SelectItem value="bug">
                                    <div className="flex items-center gap-2">
                                        <Bug className="w-4 h-4" /><span>Erro / Bug</span>
                                    </div>
                                </SelectItem>
                                <SelectItem value="melhoria">
                                    <div className="flex items-center gap-2">
                                        <Sparkles className="w-4 h-4" /><span>Melhoria</span>
                                    </div>
                                </SelectItem>
                                <SelectItem value="outro">
                                    <div className="flex items-center gap-2">
                                        <MoreHorizontal className="w-4 h-4" /><span>Outro</span>
                                    </div>
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex-1 space-y-2">
                        <Label htmlFor="prioridade">Prioridade</Label>
                        <Select value={prioridade} onValueChange={setPrioridade}>
                            <SelectTrigger id="prioridade" className="w-full">
                                <SelectValue placeholder="Selecione a prioridade" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="baixa">Baixa</SelectItem>
                                <SelectItem value="media">Média</SelectItem>
                                <SelectItem value="alta">Alta</SelectItem>
                                <SelectItem value="urgente">Urgente</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </section>

                {/* Título */}
                <section className="space-y-2">
                    <Label htmlFor="titulo">Título*</Label>
                    <Input
                        id="titulo"
                        placeholder="Resumo breve da sua sugestão ou problema encontrado"
                        className="w-full"
                        maxLength={100}
                        value={titulo}
                        onChange={(e) => setTitulo(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground text-right">
                        {titulo.length}/100
                    </p>
                </section>

                {/* Descrição */}
                <section className="space-y-2">
                    <Label htmlFor="descricao">Descrição*</Label>
                    <Textarea
                        id="descricao"
                        placeholder="Descreva todos os detalhes da sua solicitação aqui..."
                        className="w-full min-h-[120px] resize-y"
                        maxLength={2000}
                        value={descricao}
                        onChange={(e) => setDescricao(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground text-right">
                        {descricao.length}/2000
                    </p>
                </section>

                {/* ─── NOVO: Upload de Imagem ─── */}
                <section className="space-y-2">
                    <Label>Captura de tela / Imagem (opcional)</Label>

                    {/* Área de drop/clique — só aparece se não tem preview */}
                    {!previewUrl && (
                        <label
                            htmlFor="imagem-upload"
                            className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-muted-foreground/30 rounded-lg cursor-pointer hover:border-[#0080FF] hover:bg-blue-50/50 transition-colors"
                        >
                            <ImagePlus className="w-8 h-8 text-muted-foreground mb-2" />
                            <span className="text-sm text-muted-foreground">
                                Clique para anexar uma imagem
                            </span>
                            <span className="text-xs text-muted-foreground/70 mt-1">
                                JPG, PNG, GIF, WEBP — máx. 5MB
                            </span>
                            <Input
                                id="imagem-upload"
                                type="file"
                                accept="image/jpeg,image/png,image/gif,image/webp"
                                className="hidden"
                                onChange={handleImageChange}
                            />
                        </label>
                    )}

                    {/* Preview da imagem selecionada */}
                    {previewUrl && (
                        <div className="relative w-full rounded-lg overflow-hidden border border-muted">
                            <img
                                src={previewUrl}
                                alt="Preview"
                                className="w-full max-h-64 object-contain bg-muted/20"
                            />
                            <button
                                type="button"
                                onClick={removerImagem}
                                className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white rounded-full p-1 transition-colors"
                                title="Remover imagem"
                            >
                                <X className="w-4 h-4" />
                            </button>
                            <p className="text-xs text-muted-foreground px-3 py-1 bg-muted/30">
                                {imagem?.name} ({(imagem!.size / 1024).toFixed(1)} KB)
                            </p>
                        </div>
                    )}
                </section>

            </CardContent>

            <CardFooter className="flex justify-start">
                <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="bg-[#0080FF] hover:bg-blue-600 text-white hover:cursor-pointer disabled:opacity-50"
                >
                    <Send className="w-4 h-4 mr-2" />
                    {isSubmitting ? "Enviando..." : "Enviar Feedback"}
                </Button>
            </CardFooter>
        </Card>
    );
}