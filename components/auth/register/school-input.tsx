"use client";

import { SchoolData } from "@/types";
import { Image, Select, SelectItem } from "@nextui-org/react";

interface SchoolInputProps {
  field: any;
  schools: SchoolData;
  onSelectionChange: () => void;
  isLoading: boolean;
  value: string;
  errorMessage?: string;
  isInvalid: boolean;
}

export const SchoolInput = ({
  field,
  schools,
  onSelectionChange,
  isLoading,
  value,
  errorMessage,
  isInvalid,
}: SchoolInputProps) => {
  return (
    <Select
      data-testid="school-name"
      disallowEmptySelection
      items={schools}
      isDisabled={isLoading}
      label="School"
      selectedKeys={[value]}
      labelPlacement="outside"
      variant="bordered"
      size="md"
      aria-label="Choose a school"
      placeholder="Choose a school"
      errorMessage={errorMessage}
      isInvalid={isInvalid}
      onSelectionChange={onSelectionChange}
      classNames={{
        listbox: "text-primary",
      }}
      {...field}
    >
      {schools.map((school) => (
        <SelectItem
          key={school.name}
          startContent={
            <Image
              width={30}
              src={schools.filter((item) => item.name === school.name)[0].logo}
              alt="Logo"
            />
          }
        >
          {school.name}
        </SelectItem>
      ))}
    </Select>
  );
};
