import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MeusFeedbacks from "@/componentsRob/Cards/CardMeuFeedback";
import AddFeedback from "@/componentsRob/Forms/PainelFormAddFeedback";
import PageHeader from "@/componentsRob/Globals/PageHeader";
import { MessageSquarePlus } from "lucide-react";

export default function FeedbackPage() {
    return (
        <>
            <PageHeader
                title="Sugestões e Feedbacks"
                description="Compartilhe suas ideias, relate problemas ou sugira melhorias para o sistema."
                icon={MessageSquarePlus}
            />

            <Tabs defaultValue="novo" className="w-full">
                <TabsList className="mb-4 w-full ">
                    <TabsTrigger className="hover:cursor-pointer" value="novo">Novo Feedback</TabsTrigger>
                    <TabsTrigger className="hover:cursor-pointer" value="meus">Meus Feedbacks</TabsTrigger>
                </TabsList>

                <TabsContent value="novo">
                    <AddFeedback />
                </TabsContent>

                <TabsContent value="meus">
                    <MeusFeedbacks />
                </TabsContent>
            </Tabs>
        </>
    );
}