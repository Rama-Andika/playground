import { createFileRoute } from "@tanstack/react-router";
import { useImmer } from "use-immer";
import { useMutation, useQuery } from "@tanstack/react-query";
import { itemMasterQueries } from "@/queries/item-master.queries";
import {
  childrenSchemaInitialValue,
  type ChildrenSchemaType,
} from "@/schemas/children.schema";
import { getItemMasterPrice } from "@/api/item-master.api";
import { saveParent } from "@/api/parent.api";
import { useZodForm } from "@/hooks/useZodForm";
import { toast } from "sonner";
import getErrorMessage from "@/utils/error-message";
import { useState } from "react";
import DialogBarcode from "./--components/dialog-barcode";
import { useAuth } from "@/contexts/auth.context";
import ToastSuccess from "@/components/toast/toast-success";
import ToastError from "@/components/toast/toast-error";
import {
  parentSchema,
  parentSchemaInitialValues,
  type ParentSchemaType,
} from "@/schemas/parent.schema";
import RegistrationNewDesktop from "./--components/RegistrationNewDesktop";
import RegistrationNewMobile from "./--components/RegistrationNewMobile";

const locationId = import.meta.env.VITE_LOCATION_ID as string;

export const Route = createFileRoute("/_auth/registration/new")({
  component: RouteComponent,
  staticData: { breadcrumb: "Registration New" },
});

function RouteComponent() {
  const { user } = useAuth();
  const [data, setData] = useImmer<ParentSchemaType>(parentSchemaInitialValues);
  const [dialog, setDialog] = useState(false);
  const [info, setInfo] = useState<Record<string, string> | undefined>();

  //Query for get playground master
  const { data: itemMasters } = useQuery(itemMasterQueries.playground());
  const itemMasterOptions = itemMasters?.map((itemMaster) => ({
    value: itemMaster.itemId,
    label: itemMaster.itemName,
  }));

  const handleParentChange = <K extends keyof ParentSchemaType>(
    key: K,
    value: ParentSchemaType[K],
  ) => {
    setData((draft) => {
      draft[key] = value;
    });
  };

  const handleChildrenChange = async <K extends keyof ChildrenSchemaType>(
    key: K,
    id: string,
    value: ChildrenSchemaType[K],
  ) => {
    setData((draft) => {
      const child = draft.children.find((c) => c.id === id);
      if (!child) return;

      child[key] = value;
    });

    if (key === "itemId") {
      const price = await getItemMasterPrice(value as string, locationId);

      setData((draft) => {
        const child = draft.children.find((c) => c.id === id);
        if (!child) return;

        child.price = price;
      });
    }
  };

  const handleAddChild = () => {
    setData((draft) => {
      draft.children.push(childrenSchemaInitialValue());
    });
  };

  const handleDeleteChild = (id: string) => {
    setData((draft) => {
      const index = draft.children.findIndex((c) => c.id === id);
      if (index !== -1) {
        draft.children.splice(index, 1);
      }
    });
  };

  const { validate, errors } = useZodForm(parentSchema);
  //Mutate for create parent
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (data: ParentSchemaType) => saveParent(data),
  });

  const handleContinue = async () => {
    if (!validate(data)) {
      toast(<ToastError message="Please fill in the required fields." />);
      return;
    }

    try {
      const body: ParentSchemaType = { ...data, userId: user?.userId ?? "" };

      const result = await mutateAsync(body);
      setInfo(result);
      setDialog(true);
      setData(parentSchemaInitialValues);
      toast(<ToastSuccess message="Registration successfully!" />);
    } catch (error: any) {
      toast(<ToastError message={getErrorMessage(error)} />);
    }
  };

  const PAGE_TITLE = "New Registration";
  const PAGE_SUBTITLE = "Session registration for Parents & Children";

  const sharedProps = {
    data,
    itemMasterOptions,
    handleParentChange,
    handleChildrenChange,
    handleContinue,
    handleAddChild,
    handleDeleteChild,
    errors,
    isPending,
    title: PAGE_TITLE,
    subtitle: PAGE_SUBTITLE,
  };

  return (
    <div className="w-full h-full">
      {/* Tampilan Desktop */}
      <div className="hidden md:block">
        <RegistrationNewDesktop {...sharedProps} />
      </div>

      {/* Tampilan Mobile */}
      <div className="md:hidden h-full">
        <RegistrationNewMobile {...sharedProps} />
      </div>

      <DialogBarcode open={dialog} setOpen={setDialog} data={info} />
    </div>
  );
}
