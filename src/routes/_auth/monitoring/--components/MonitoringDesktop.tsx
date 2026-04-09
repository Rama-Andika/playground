import { PageHeader } from "@/components/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Active from "./active";
import Inactive from "./incative";
import { getRouteApi } from "@tanstack/react-router";

const route = getRouteApi("/_auth/monitoring/");

const MonitoringDesktop = ({ title, subtitle }: { title: string, subtitle: string }) => {
    const { tab } = route.useSearch();
    const navigate = route.useNavigate();

    return (
        <div className="flex flex-col gap-6 p-8 max-w-[1400px] mx-auto animate-in fade-in duration-500">
            <PageHeader 
                title={title} 
                subtitle={subtitle} 
            />

            <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
                <Tabs
                    className="w-full"
                    value={tab}
                    onValueChange={(value: any) =>
                        navigate({
                            search: (prev: any) => ({ ...prev, tab: value }),
                        })
                    }
                >
                    <div className="px-6 pt-6 border-b bg-muted/30">
                        <TabsList className="mb-[-1px] bg-transparent h-12 p-0 gap-8">
                            <TabsTrigger 
                                value="active" 
                                className="h-full  border-b-2 border-transparent data-[state=active]:border-main data-[state=active]:text-main data-[state=active]:bg-transparent px-2 font-semibold transition-all"
                            >
                                Active Sessions
                            </TabsTrigger>
                            <TabsTrigger 
                                value="inactive" 
                                className="h-full  border-b-2 border-transparent data-[state=active]:border-main data-[state=active]:text-main data-[state=active]:bg-transparent px-2 font-semibold transition-all"
                            >
                                Inactive History
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    <div className="p-6">
                        <TabsContent value="active" className="mt-0 outline-none">
                            <div className="border rounded-lg bg-background">
                                <Active />
                            </div>
                        </TabsContent>
                        <TabsContent value="inactive" className="mt-0 outline-none">
                            <div className="border rounded-lg bg-background">
                                <Inactive />
                            </div>
                        </TabsContent>
                    </div>
                </Tabs>
            </div>
        </div>
    );
};

export default MonitoringDesktop;
