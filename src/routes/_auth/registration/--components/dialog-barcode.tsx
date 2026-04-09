import QRCodeGenerator from "@/components/qr-code/qr-code-generator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Props {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  data: Record<string, any> | undefined;
}
const DialogBarcode = ({ open, setOpen, data }: Props) => {
  if (!open) return null;

  const regNumber = data?.["reg_number"] ?? "";
  const parentName = data?.["parent_name"] ?? "";
  const parentPhone = data?.["parent_phone"] ?? "";
  const children = data?.["children"] ?? [];
  return (
    <Dialog open={open} onOpenChange={(open) => setOpen(open)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Registration Success</DialogTitle>
          <DialogDescription>
            <div className="flex justify-between gap-2 items-start">
              <div>
                <p className="text-lg font-semibold">{regNumber}</p>
                <p>{parentName}</p>
                <p>{parentPhone}</p>
              </div>
              <QRCodeGenerator size={100} value={regNumber} />
            </div>
            <div>
              <h3 className="text-sm font-bold">Children</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>name</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {children?.map((child: any) => (
                    <TableRow key={child.id}>
                      <TableCell>{child.name}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default DialogBarcode;
