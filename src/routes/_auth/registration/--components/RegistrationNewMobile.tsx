import { 
    Page, 
    List, 
    ListInput, 
    BlockTitle, 
    Button, 
    Block,
    ListItem
} from "konsta/react";
import type { RegistrationNewProps } from "./types";
import { formatNumberWithDecimals } from "@/utils/format-number";
import { toValidNumber } from "@/utils/to-valid-number";
import { MdAddCircle, MdDelete } from "react-icons/md";
import { PageHeader } from "@/components/page-header";

const RegistrationNewMobile = ({
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
    <Page className="pt-16 pb-32">
      <PageHeader 
        title={title} 
        subtitle={subtitle} 
      />

      <BlockTitle>Parent Data</BlockTitle>
      <List strong inset>
        <ListInput
          label="Parent Name"
          type="text"
          placeholder="Full Name"
          value={data.name}
          onChange={(e) => handleParentChange("name", e.target.value)}
          error={errors.name}
        />
        <ListInput
          label="Phone Number"
          type="tel"
          placeholder="e.g. 08123456789"
          value={data.phone}
          onChange={(e) => handleParentChange("phone", e.target.value)}
          error={errors.phone}
        />
        <ListInput
          label="Identity Code"
          type="text"
          placeholder="ID or NIK"
          value={data.code}
          onChange={(e) => handleParentChange("code", e.target.value)}
        />
      </List>

      <div className="flex items-center justify-between mx-4 mt-6">
        <BlockTitle className="m-0! p-0!">Children / Guardian</BlockTitle>
        <Button
            className="w-auto px-4 rounded-full bg-main/10 text-main"
            onClick={handleAddChild}
        >
            <MdAddCircle className="mr-1 h-5 w-5" />
            Add
        </Button>
      </div>

      {data.children.map((child, index) => (
        <div key={child.id} className="mt-4 animate-in slide-in-from-right duration-300">
            <Block strong outline className="mb-0 flex justify-between items-center bg-muted/20">
                <span className="font-bold text-main">Child #{index + 1}</span>
                {data.children.length > 1 && (
                    <Button 
                        clear 
                        className="w-auto h-auto p-2 text-red-500"
                        onClick={() => handleDeleteChild(child.id)}
                    >
                        <MdDelete className="h-5 w-5" />
                    </Button>
                )}
            </Block>
            <List strong inset className="mt-0!">
                <ListInput
                    label="FullName"
                    type="text"
                    placeholder="Child name"
                    value={child.name}
                    onChange={(e) => handleChildrenChange("name", child.id, e.target.value)}
                    error={errors[`children.${index}.name`]}
                />
                <ListInput
                    label="Age"
                    type="number"
                    placeholder="Enter age"
                    value={child.age || ""}
                    onChange={(e) => handleChildrenChange("age", child.id, toValidNumber(e.target.value))}
                />
                <ListInput
                    label="Child Code"
                    type="text"
                    placeholder="Optional code"
                    value={child.code}
                    onChange={(e) => handleChildrenChange("code", child.id, e.target.value)}
                />
                <ListInput
                    label="Session Item"
                    type="select"
                    dropdown
                    value={child.itemId}
                    onChange={(e) => handleChildrenChange("itemId", child.id, e.target.value)}
                    error={errors[`children.${index}.itemId`]}
                    className="mt-2"
                >
                    <option value="" disabled>Select Item...</option>
                    {itemMasterOptions?.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </ListInput>
                <ListItem
                    title="Price Amount"
                    after={
                        <span className="font-bold text-main">
                            Rp {formatNumberWithDecimals(child.price)}
                        </span>
                    }
                />
            </List>
        </div>
      ))}

      <Block className="fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-t pb-4 safe-areas">
        <Button
            large
            className="bg-main rounded-md text-white py-4 shadow-lg active:scale-95 transition-transform"
            onClick={handleContinue}
            disabled={isPending}
        >
            {isPending ? "Processing..." : "Register Now"}
        </Button>
      </Block>
    </Page>
  );
};

export default RegistrationNewMobile;
