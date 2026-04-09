import { stopSession } from "@/api/playground-session.api";
import { AlertDialogConfirmation } from "@/components/alert-dialog/alert-dialog-confirmation";
import ToastSuccess from "@/components/toast/toast-success";
import { Button } from "@/components/ui/button";
import { playgroundSessionQueries } from "@/queries/playground-session.queries";
import { queryClient } from "@/query/queryClient";
import { useMutation } from "@tanstack/react-query";
import { getRouteApi } from "@tanstack/react-router";
import { toast } from "sonner";

interface Props {
  sessionId: string;
}
const ActionCell = ({ sessionId }: Props) => {
  const route = getRouteApi("/_auth/monitoring/");
  const search = route.useSearch();

  const { mutate } = useMutation({
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
    <>
      <AlertDialogConfirmation onClickContinue={() => mutate()}>
        <Button size={"sm"} className="bg-red-500 hover:bg-red-600">
          Done
        </Button>
      </AlertDialogConfirmation>
    </>
  );
};

export default ActionCell;
