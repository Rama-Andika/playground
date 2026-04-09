import ButtonFilter from "@/components/button/ButtonFilter";
import ButtonSearch from "@/components/button/ButtonSearch";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Field, FieldGroup, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { ReactDatePicker } from "@/components/ui/react-date-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { PROMOTION_SUB_TYPE } from "@/enums/promotion-sub-type.enum";
import {
  PROMOTION_TYPE,
} from "@/enums/promotion-type.enum";
import { SelectValue } from "@radix-ui/react-select";

export function DrawerFilter() {
  return (
    <Drawer direction="right">
      <DrawerTrigger asChild>
        <ButtonFilter className="w-fit" />
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Filter</DrawerTitle>
        </DrawerHeader>
        <div className="px-4">
          <FieldSet>
            <FieldGroup>
              <Field>
                <ReactDatePicker placeholderText="Start Date" />
              </Field>
              <Field>
                <ReactDatePicker placeholderText="End Date" />
              </Field>
              <Field>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Type..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    {Object.keys(PROMOTION_TYPE).map((key) => {
                      const k = parseInt(key);
                      return (
                        <SelectItem key={key} value={key}>
                          {PROMOTION_TYPE[k]}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </Field>
              <Field>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Sub Type..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    {Object.keys(PROMOTION_SUB_TYPE).map((key) => {
                      const k = parseInt(key);
                      return (
                        <SelectItem key={key} value={key}>
                          {PROMOTION_SUB_TYPE[k]}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </Field>
              <Field>
                <Input placeholder="Description" />
              </Field>
            </FieldGroup>
          </FieldSet>
        </div>
        <DrawerFooter>
          <div className="flex items-center gap-1">
            <DrawerClose asChild>
              <div className="w-full">
                <Button className="w-full bg-red-500 hover:bg-red-600">
                  Cancel
                </Button>
              </div>
            </DrawerClose>
            <DrawerClose asChild>
              <div className="w-full">
                <ButtonSearch />
              </div>
            </DrawerClose>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
