"use client";

import React from "react";
import { Destination } from "./vacation-list";
import { useCopilotReadable } from "@copilotkit/react-core";
import Image from "next/image";

export type DestinationRowProps = {
  destination: Destination;
  isChecked: boolean;
  onCheckChange: (isChecked: boolean) => void;
  parentCopilotPointer?: string;
};

/**
 * Render a table row displaying a destination with an interactive selection checkbox.
 *
 * Renders the destination's avatar, name, country, description, and activities. The checkbox reflects `isChecked` and calls `onCheckChange` with the new checked state when toggled. If provided, `parentCopilotPointer` is forwarded to Copilot readable metadata.
 *
 * @param destination - The destination data to display.
 * @param isChecked - Whether the row's checkbox is currently checked.
 * @param onCheckChange - Callback invoked with the checkbox's new checked value.
 * @param parentCopilotPointer - Optional identifier forwarded to Copilot-readable metadata.
 * @returns A `<tr>` JSX element representing the destination row.
 */
export function DestinationRow({
  destination,
  isChecked,
  onCheckChange,
  parentCopilotPointer,
}: DestinationRowProps) {
  useCopilotReadable({
    description: "A row in the destination list",
    value: {
      name: destination.name,
      country: destination.country,
      description: destination.description,
      activities: destination.activities,
      isSelected: isChecked,
    },
    parentId: parentCopilotPointer,
  });

  return (
    <tr key={destination.name}>
      <td className="whitespace-nowrap py-5 pl-4 px-3 text-sm">
        <div className="flex items-center">
          <div className="h-20 w-20 flex-shrink-0">
            <img className="h-full w-full rounded-full" src={destination.image} alt="" />
          </div>
          <div className="ml-4">
            <div className="font-medium text-gray-900">{destination.name}</div>
            <div className="mt-1 text-gray-500">{destination.country}</div>
          </div>
        </div>
      </td>
      <td className="whitespace-nowrap py-5 pl-4 pr-3 text-sm">
        <div className="w-full flex items-stretch">
          <div className="flex items-center justify-center w-full">
            <input
              data-test-id={`checkbox-${destination.name.toLowerCase().replace(/\s+/g, "-")}-${isChecked ? "checked" : "unchecked"}`}
              type="checkbox"
              checked={isChecked}
              onChange={(event) => onCheckChange(event.target.checked)}
            />
          </div>
        </div>
      </td>
      <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
        <div className="text-gray-900">{destination.description}</div>
      </td>
      <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
        {destination.activities}
      </td>
    </tr>
  );
}