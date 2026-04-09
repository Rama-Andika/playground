import { 
    Page, 
    List, 
    ListItem, 
    BlockTitle, 
    Segmented, 
    SegmentedButton, 
    Badge, 
    Block
} from "konsta/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { playgroundSessionQueries } from "@/queries/playground-session.queries";
import { getRouteApi } from "@tanstack/react-router";
import dayjs from "dayjs";
import { PLAYGROUND_STATUS_BADGE } from "@/enums/playground-session-status.enum";
import { CountdownCell } from "../--components/table/countdown-cell";

import { PageHeader } from "@/components/page-header";
import { stopSession } from "@/api/playground-session.api";
import { queryClient } from "@/query/queryClient";
import { toast } from "sonner";
import ToastSuccess from "@/components/toast/toast-success";
import { AlertDialogConfirmation } from "@/components/alert-dialog/alert-dialog-confirmation";
import { Button } from "@/components/ui/button";

const route = getRouteApi("/_auth/monitoring/");

const MonitoringMobileAction = ({ sessionId }: { sessionId: string }) => {
    const search = route.useSearch();

    const { mutate, isPending } = useMutation({
        mutationFn: () => stopSession(sessionId),
        onSuccess: () => {
            toast(<ToastSuccess message="Session has been stopped" />);

            queryClient.invalidateQueries({
                queryKey: playgroundSessionQueries.liveSession().queryKey,
            });

            queryClient.invalidateQueries({
                queryKey: playgroundSessionQueries.endSession({
                    date: search.date,
                    page: search.page,
                    size: search.size,
                }).queryKey,
            });
        },
    });

    return (
        <AlertDialogConfirmation onClickContinue={() => mutate()}>
            <Button 
                size="sm" 
                variant="destructive"
                className="h-7 px-3 text-[10px] font-bold uppercase tracking-wider w-fit"
                disabled={isPending}
            >
                Done
            </Button>
        </AlertDialogConfirmation>
    );
};

const MonitoringMobile = ({ title, subtitle }: { title: string, subtitle: string }) => {
    const { tab, date, page, size } = route.useSearch();
    const navigate = route.useNavigate();

    const activeQuery = useQuery(playgroundSessionQueries.liveSession());
    const inactiveQuery = useQuery(playgroundSessionQueries.endSession({ date, page, size }));

    const sessions = tab === "active" ? (activeQuery.data ?? []) : (inactiveQuery.data?.data ?? []);
    const isLoading = tab === "active" ? activeQuery.isLoading : inactiveQuery.isLoading;

    return (
        <Page className="pt-16 pb-20 pb-safe">
            <PageHeader 
                title={title} 
                subtitle={subtitle} 
            />

            <Block strong outline className="mt-4">
                <Segmented rounded strong>
                    <SegmentedButton
                        active={tab === "active"}
                        onClick={() => navigate({ search: (prev: any) => ({ ...prev, tab: "active" }) })}
                    >
                        Active
                    </SegmentedButton>
                    <SegmentedButton
                        active={tab === "inactive"}
                        onClick={() => navigate({ search: (prev: any) => ({ ...prev, tab: "inactive" }) })}
                    >
                        History
                    </SegmentedButton>
                </Segmented>
            </Block>

            <BlockTitle>{tab === "active" ? "Active Sessions" : `History (${date})`}</BlockTitle>

            {isLoading ? (
                <Block strong className="text-center text-muted-foreground animate-pulse">
                    Loading sessions...
                </Block>
            ) : sessions.length === 0 ? (
                <Block strong className="text-center text-muted-foreground italic">
                    No sessions found.
                </Block>
            ) : (
                <List strong inset>
                    {sessions.map((session: any) => {
                        const statusBadge = PLAYGROUND_STATUS_BADGE[session.status as keyof typeof PLAYGROUND_STATUS_BADGE];
                        
                        return (
                            <ListItem
                                key={session.sessionId}
                                title={session.childName}
                                contentClassName="items-start"
                                after={
                                    <div className="flex flex-col items-end gap-2">
                                        <Badge style={{ backgroundColor: statusBadge?.bg, color: statusBadge?.text }}>
                                            {session.status?.replaceAll("_", " ")}
                                        </Badge>
                                    </div>
                                }
                                subtitle={session.parentName}
                                text={`Code: ${session.code || "-"} | ${dayjs(session.endTime).format("HH:mm")}`}
                                media={
                                    <div 
                                        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold mt-2"
                                        style={{ backgroundColor: "#00b4d8" }}
                                    >
                                        {session.childName?.charAt(0) || "P"}
                                    </div>
                                }
                          
                                footer={
                                    tab === "active" && (
                                            <div className="flex flex-col items-end gap-1">
                                               
                                                    <CountdownCell endTime={session.endTime} className="text-left! pr-0!" />
                                                
                                                <MonitoringMobileAction sessionId={session.sessionId} />
                                            </div>
                                        )
                                }
                            />
                        );
                    })}
                </List>
            )}
        </Page>
    );
};

export default MonitoringMobile;
