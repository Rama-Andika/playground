import FieldError from "@/components/field-error";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { TSelectOption } from "@/components/ui/SelectReact";
import SelectReact from "@/components/ui/SelectReact";
import { PAYMENT_CODE, PAYMENT_TYPE } from "@/enums/payment-method.enum";
import { useZodForm } from "@/hooks/useZodForm";
import { bankQueries } from "@/queries/bank.queries";
import { merchantQueries } from "@/queries/merchant.queries";
import { paymentMethodQueries } from "@/queries/payment-method.queries";
import {
  paymentSchema,
  paymentSchmeaInitialValue,
  type PaymentSchemaType,
} from "@/schemas/payment.schema";
import { formatNumberWithDecimals } from "@/utils/format-number";
import { toValidNumber } from "@/utils/to-valid-number";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { toast } from "sonner";
import { useImmer } from "use-immer";
import ToastError from "../toast/toast-error";
import { MERCHANT_PAYMENT_BY } from "@/enums/merchant.enum";
import { useEffect } from "react";
const locationId = import.meta.env.VITE_LOCATION_ID as string;

interface Props {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  total: number;
  onClick: (payment: PaymentSchemaType) => void;
}
const DialogPayment = ({ open, setOpen, total, onClick }: Props) => {
  if (!open) return null;

  const [payment, setPayment] = useImmer<PaymentSchemaType>({
    ...paymentSchmeaInitialValue,
  });

  //Check Merchant Payment By customer
  const calculatedTotal =
    payment.merchantPaymentBy === MERCHANT_PAYMENT_BY.CUSTOMER
      ? total + total * (payment.merchantPercentExpense / 100)
      : total;

  const balance = payment.amount - calculatedTotal;

  //Query Payment Method
  const { data: paymentMethodsData } = useQuery(paymentMethodQueries.all());
  const paymentCode =
    paymentMethodsData?.find(
      (method) => method.paymentMethodId === payment.paymentMethodId,
    )?.posCode ?? 0;

  const paymentType =
    paymentMethodsData?.find(
      (method) => method.paymentMethodId === payment.paymentMethodId,
    )?.type ?? 0;

  //Query Merchant by Location
  const { data: merchantsData } = useQuery(
    merchantQueries.byLocationId(locationId),
  );

  //Query Bank
  const { data: banksData } = useQuery(bankQueries.all());

  useEffect(() => {
    setPayment((draft) => {
      draft.amount = calculatedTotal;
    });
  }, [calculatedTotal]);

  useEffect(() => {
    if (paymentCode === PAYMENT_CODE.NON_REFUND) {
      setPayment((draft) => {
        draft.amount = calculatedTotal;
      });
    }
  }, [calculatedTotal, paymentCode]);

  const merchantOptions: TSelectOption[] =
    merchantsData
      ?.filter(
        (merchant) => merchant.paymentMethodId === payment.paymentMethodId,
      )
      ?.map((merchant) => ({
        value: merchant.merchantId,
        label: merchant.description,
        paymentBy: merchant.paymentBy,
        percentExpense: merchant.persenExpense,
      })) ?? [];

  const bankOptions: TSelectOption[] =
    banksData?.map((bank) => ({
      value: bank.bankId,
      label: bank.name,
      payment,
    })) ?? [];

  const handleChange = <K extends keyof PaymentSchemaType>(
    key: K,
    value: PaymentSchemaType[K],
  ) => {
    setPayment((draft) => {
      draft[key] = value;

      if (key === "paymentMethodId") {
        draft.bankId = "";
        draft.merchantId = "";
      }

      if (key === "merchantId") {
        draft.merchantPaymentBy =
          (merchantOptions.find((option) => option.value === value)
            ?.paymentBy as number) ?? 0;
        draft.merchantPercentExpense =
          (merchantOptions.find((option) => option.value === value)
            ?.percentExpense as number) ?? 0;
      }
    });
  };

  const { errors, validate } = useZodForm(paymentSchema);
  const handlePayment = async () => {
    const body: PaymentSchemaType = {
      ...payment,
      payDate: dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss"),
    };

    if (!validate(body)) {
      toast(<ToastError message="Please fill in the required fields." />);
      return;
    }

    if (body.amount < calculatedTotal) {
      toast(<ToastError message="Payment failed, insufficient balance." />);
      return;
    }

    if (
      paymentCode === PAYMENT_CODE.NON_REFUND &&
      paymentType === PAYMENT_TYPE.USE_MERCHANT &&
      !body.merchantId
    ) {
      toast(<ToastError message="Please select a merchant." />);
      return;
    }

    if (
      paymentCode === PAYMENT_CODE.NON_REFUND &&
      paymentType === PAYMENT_TYPE.USE_BANK &&
      !body.bankId
    ) {
      toast(<ToastError message="Please select a bank." />);
      return;
    }

    onClick(body);
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>Payment</DialogTitle>
        </DialogHeader>
        <div className="grid gap-2">
          <div className="text-end text-lg font-bold">
            Total: {formatNumberWithDecimals(calculatedTotal)}
            {payment.merchantPaymentBy === MERCHANT_PAYMENT_BY.CUSTOMER && (
              <div className="text-sm text-muted-foreground">
                {`(include merchant fee ${payment.merchantPercentExpense}%)`}
              </div>
            )}
          </div>
          <div className="grid gap-3">
            <Label required htmlFor="name-1">
              Method
            </Label>
            <Select
              value={payment.paymentMethodId}
              onValueChange={(value) => handleChange("paymentMethodId", value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a method" />
              </SelectTrigger>
              <SelectContent>
                {paymentMethodsData?.map((paymentMethod) => (
                  <SelectItem
                    key={paymentMethod.paymentMethodId}
                    value={paymentMethod.paymentMethodId}
                  >
                    {paymentMethod.description}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.paymentMethodId && (
              <FieldError>{errors.paymentMethodId}</FieldError>
            )}
          </div>
          {paymentCode === PAYMENT_CODE.NON_REFUND &&
            paymentType === PAYMENT_TYPE.USE_MERCHANT && (
              <div className="grid gap-3">
                <Label required htmlFor="username-1">
                  Merchant
                </Label>
                <SelectReact
                  options={merchantOptions}
                  value={
                    merchantOptions.find(
                      (m) => m.value === payment.merchantId,
                    ) ?? null
                  }
                  onChange={(item: any) =>
                    handleChange("merchantId", item.value)
                  }
                />
              </div>
            )}
          {paymentCode === PAYMENT_CODE.NON_REFUND &&
            paymentType === PAYMENT_TYPE.USE_BANK && (
              <div className="grid gap-3">
                <Label required htmlFor="username-1">
                  Bank
                </Label>
                <SelectReact
                  options={bankOptions}
                  value={
                    bankOptions.find((m) => m.value === payment.bankId) ?? null
                  }
                  onChange={(item: any) => handleChange("bankId", item.value)}
                />
              </div>
            )}
          <div className="grid gap-3">
            <Label htmlFor="username-1">Pay</Label>
            <Input
              value={formatNumberWithDecimals(payment.amount)}
              onChange={(e) =>
                handleChange("amount", toValidNumber(e.target.value))
              }
              className="font-medium"
              disabled={paymentCode === PAYMENT_CODE.NON_REFUND}
            />
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <p className="w-20">return</p>
              <p className="w-24 text-right">
                {formatNumberWithDecimals(balance)}
              </p>
            </div>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            onClick={handlePayment}
            className="bg-green-500 hover:bg-green-400"
          >
            Payment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DialogPayment;
