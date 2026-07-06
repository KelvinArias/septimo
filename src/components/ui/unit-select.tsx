import { SelectControl } from "./select-control";
import { units } from "@/lib/constants";
import type { Unit } from "@/types";

type UnitSelectProps = {
  className?: string;
  value: Unit;
  onChange: (unit: Unit) => void;
};

export function UnitSelect({ className, value, onChange }: UnitSelectProps) {
  return (
    <SelectControl
      className={className}
      value={value}
      onChange={(event) => onChange(event.target.value as Unit)}
    >
      {units.map((unit) => (
        <option key={unit}>{unit}</option>
      ))}
    </SelectControl>
  );
}
