import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MdAddCircle } from "react-icons/md";
import SelectReact from "@/components/ui/SelectReact";
import ButtonSave from "@/components/button/ButtonSave";
import { AlertDialogConfirmation } from "@/components/alert-dialog/alert-dialog-confirmation";
import FieldError from "@/components/field-error";
import { PageHeader } from "@/components/page-header";
import parentImage from "@/assets/images/parent.jpg";
import { formatNumberWithDecimals } from "@/utils/format-number";
import { toValidNumber } from "@/utils/to-valid-number";
import type { RegistrationNewProps } from "./types";

const RegistrationNewDesktop = ({
  data,
  itemMasterOptions,
  handleParentChange,
  handleChildrenChange,
  handleContinue,
  handleAddChild,
  handleDeleteChild,
  errors,
  isPending,
  title,
  subtitle,
}: RegistrationNewProps) => {
  return (
    <div className="flex flex-col gap-6 p-8 max-w-[1400px] mx-auto animate-in fade-in duration-500">
      <PageHeader 
        title={title} 
        subtitle={subtitle} 
      />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start">
        <div className="flex flex-col gap-6">
          <h2 className="font-bold text-2xl tracking-tight">Parent Information</h2>
          <Card className="shadow-sm border-main/20">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <Label required htmlFor="parentName" className="text-sm font-medium">
                    Parent Full Name
                  </Label>
                  <Input
                    id="parentName"
                    name="parentName"
                    placeholder="Enter parent name..."
                    className="mt-1! focus-visible:ring-main"
                    value={data.name}
                    onChange={(e) => handleParentChange("name", e.target.value)}
                  />
                  <FieldError>{errors.name}</FieldError>
                </div>

                <div>
                  <Label required htmlFor="parentPhone" className="text-sm font-medium">
                    Phone Number
                  </Label>
                  <Input
                    id="parentPhone"
                    name="parentPhone"
                    placeholder="e.g. 08123456789"
                    className="mt-1! focus-visible:ring-main"
                    value={data.phone}
                    onChange={(e) => handleParentChange("phone", e.target.value)}
                  />
                  <FieldError>{errors.phone}</FieldError>
                </div>

                <div>
                  <Label htmlFor="parentCode" className="text-sm font-medium">
                    Identity Code (Optional)
                  </Label>
                  <Input
                    id="parentCode"
                    name="parentCode"
                    placeholder="ID or NIK"
                    className="mt-1! focus-visible:ring-main"
                    value={data.code}
                    onChange={(e) => handleParentChange("code", e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center justify-between mt-4">
            <h2 className="font-bold text-2xl tracking-tight">Children or Guardian</h2>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="border-main text-main hover:bg-main/5"
              onClick={handleAddChild}
            >
              <MdAddCircle className="mr-2 h-4 w-4" />
              Add Child
            </Button>
          </div>

          <div className="flex flex-col gap-4">
            {data.children.map((child, index) => (
              <Card key={child.id} className="shadow-sm transition-all border-l-4 border-l-main/50">
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2 flex justify-between items-start">
                      <div className="flex-1">
                        <Label required className="text-xs font-semibold uppercase text-muted-foreground">
                          Child Name
                        </Label>
                        <Input
                          placeholder="Child full name"
                          className="mt-1! focus-visible:ring-main"
                          value={child.name}
                          onChange={(e) => handleChildrenChange("name", child.id, e.target.value)}
                        />
                        <FieldError>{errors[`children.${index}.name`]}</FieldError>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                        onClick={() => handleDeleteChild(child.id)}
                      >
                        <span className="sr-only">Delete</span>
                        ×
                      </Button>
                    </div>

                    <div>
                      <Label className="text-xs font-semibold uppercase text-muted-foreground">Age</Label>
                      <Input
                        type="number"
                        placeholder="Age"
                        className="mt-1! focus-visible:ring-main"
                        value={child.age}
                        onChange={(e) => handleChildrenChange("age", child.id, toValidNumber(e.target.value))}
                      />
                    </div>

                    <div>
                      <Label className="text-xs font-semibold uppercase text-muted-foreground">Child Code</Label>
                      <Input
                        placeholder="Optional code"
                        className="mt-1! focus-visible:ring-main"
                        value={child.code}
                        onChange={(e) => handleChildrenChange("code", child.id, e.target.value)}
                      />
                    </div>

                    <div className="md:col-span-2">
                        <Label required className="text-xs font-semibold uppercase text-muted-foreground">Session Item</Label>
                        <div className="mt-1!">
                            <SelectReact
                                options={itemMasterOptions}
                                value={itemMasterOptions?.find((i) => i.value === child.itemId)}
                                onChange={(item: any) => handleChildrenChange("itemId", child.id, item.value)}
                            />
                        </div>
                        <FieldError>{errors[`children.${index}.itemId`]}</FieldError>
                    </div>

                    <div className="md:col-span-2 bg-muted/20 p-3 rounded-lg border border-dashed text-right font-mono text-sm">
                      <span className="text-muted-foreground mr-2">Price:</span>
                      <span className="font-bold text-main">Rp {formatNumberWithDecimals(child.price)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-8 flex justify-end p-4 bg-muted/30 rounded-xl border">
            <AlertDialogConfirmation onClickContinue={handleContinue}>
              <ButtonSave
                disabled={isPending}
                loading={isPending}
              />
            </AlertDialogConfirmation>
          </div>
        </div>

        <div className="sticky top-8 hidden xl:flex flex-col items-center">
            <div className="relative group overflow-hidden rounded-2xl shadow-xl w-full">
                <img 
                    src={parentImage} 
                    alt="Registration" 
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-linear-to-t from-main/30 to-transparent pointer-events-none" />
            </div>
            <div className="mt-6 text-center">
                <p className="text-muted-foreground px-10 italic">
                    "Creating moments of joy and development for our little ones starts with a simple registration."
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationNewDesktop;
