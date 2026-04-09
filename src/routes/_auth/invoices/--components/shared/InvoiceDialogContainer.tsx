import DialogCustomer from "@/components/dialog/dialog-customer";
import DialogItemMasterWithPrice from "@/components/dialog/dialog-item-master-with-price";
import DialogPayment from "@/components/dialog/dialog-payment";
import InvoiceItemDialog from "../dialogs/InvoiceItemDialog";
import { toValidNumber } from "@/utils/to-valid-number";
import type { SalesTakingPlaygroundView } from "@/interfaces/sales-taking.interface";
import { useInvoiceContext } from "../context/InvoiceFormContext";

const InvoiceDialogContainer = () => {
  const {
    setSales,
    setSalesDetail,
    total,
    dialogCustomer,
    setDialogCustomer,
    dialogPayment,
    setDialogPayment,
    dialogItemMasterWithPrice,
    setDialogItemMasterWithPrice,
    handlePayment,
    inputsRef,
  } = useInvoiceContext();

  return (
    <>
      <InvoiceItemDialog />

      <DialogCustomer
        open={dialogCustomer}
        setOpen={setDialogCustomer}
        handleSelect={(customer) =>
          setSales((draft: SalesTakingPlaygroundView) => {
            draft.customerId = customer.id;
            draft.customerPhone = customer.phone ?? "";
            draft.customerName = customer.name;
            draft.parentName = customer.name;
            draft.parentPhone = customer.phone ?? "";
          })
        }
      />

      {dialogItemMasterWithPrice !== undefined &&
        setDialogItemMasterWithPrice !== undefined && (
          <DialogItemMasterWithPrice
            open={dialogItemMasterWithPrice}
            setOpen={setDialogItemMasterWithPrice}
            handleSelect={(itemMaster) => {
              setSalesDetail((draft) => {
                draft.itemMasterId = itemMaster.itemId;
                draft.itemMasterName = itemMaster.itemName;
                draft.itemMasterBarcode = itemMaster.barcode;
                draft.convQty = toValidNumber(itemMaster.convQty);
                draft.uomId = itemMaster.uomId ?? "";
                draft.qty = 1;
                draft.discountItem = 0;
                draft.discountItemPercent = 0;
                draft.price = toValidNumber(itemMaster.price);
                draft.total = draft.price * draft.qty;
              });

              setTimeout(() => {
                inputsRef?.current?.[3]?.focus();
              }, 100);
            }}
          />
        )}

      {handlePayment && (
        <DialogPayment
          open={dialogPayment}
          setOpen={setDialogPayment}
          total={total ?? 0}
          onClick={handlePayment}
        />
      )}
    </>
  );
};

export default InvoiceDialogContainer;
