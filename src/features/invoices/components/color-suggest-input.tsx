import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useRef, useState, type JSX } from "react";

interface ColorSuggestInputProps {
  id: string;
  value: string;
  invalid: boolean;
  onCommit: (value: string) => void;
  onDraft: () => void;
}

const colorOptions: string[] = [
  "Beige",
  "Black",
  "Bottle Green",
  "Brown",
  "Burgundy",
  "Charcoal",
  "Cream",
  "Dark Green",
  "Gold",
  "Grey",
  "Ivory",
  "Khaki",
  "Light Blue",
  "Maroon",
  "Navy",
  "Off White",
  "Olive",
  "Pink",
  "Red",
  "Royal Blue",
  "Sky Blue",
  "White",
  "Yellow",
];

export function ColorSuggestInput({
  id,
  value,
  invalid,
  onCommit,
  onDraft,
}: ColorSuggestInputProps): JSX.Element {
  const [query, setQuery] = useState<string>(value);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [hasTyped, setHasTyped] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const listboxId = `${id}-options`;
  const normalizedQuery = query.trim().toLocaleLowerCase();
  const matches = hasTyped
    ? colorOptions.filter((color) =>
        color.toLocaleLowerCase().includes(normalizedQuery)
      )
    : colorOptions;
  const exactMatch = colorOptions.some(
    (color) => color.toLocaleLowerCase() === normalizedQuery
  );

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent): void => {
      if (
        event.target instanceof Node &&
        !containerRef.current?.contains(event.target)
      ) {
        setIsOpen(false);
        setQuery(value);
        setHasTyped(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [value]);

  const commitColor = (color: string): void => {
    setQuery(color);
    setHasTyped(false);
    setIsOpen(false);
    onCommit(color);
  };

  return (
    <div ref={containerRef} className="relative">
      <Input
        id={id}
        value={query}
        role="combobox"
        aria-invalid={invalid}
        aria-autocomplete="list"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={isOpen ? listboxId : undefined}
        autoComplete="off"
        placeholder="Search or enter a color"
        onFocus={() => {
          setIsOpen(true);
          setHasTyped(false);
        }}
        onChange={(event) => {
          setQuery(event.currentTarget.value);
          setHasTyped(true);
          setIsOpen(true);
          onDraft();
        }}
        onBlur={(event) => {
          if (
            event.relatedTarget instanceof Node &&
            containerRef.current?.contains(event.relatedTarget)
          ) {
            return;
          }
          setQuery(value);
          setHasTyped(false);
          setIsOpen(false);
        }}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            setQuery(value);
            setHasTyped(false);
            setIsOpen(false);
          }
        }}
      />
      {isOpen ? (
        <div
          id={listboxId}
          role="listbox"
          aria-label="Common textile colors"
          className="absolute inset-x-0 top-full z-20 mt-1 flex max-h-56 flex-col gap-1 overflow-y-auto rounded-lg border border-border bg-popover p-1 shadow-md"
        >
          {hasTyped && query.trim() && !exactMatch ? (
            <Button
              type="button"
              variant="secondary"
              role="option"
              aria-selected="false"
              className="justify-start py-1 text-left"
              onPointerDown={(event) => event.preventDefault()}
              onClick={() => commitColor(query.trim())}
            >
              Use custom color: {query.trim()}
            </Button>
          ) : null}
          {matches.map((color) => (
            <Button
              key={color}
              type="button"
              variant="ghost"
              role="option"
              aria-selected={color === value}
              className="justify-start py-1 text-left"
              onPointerDown={(event) => event.preventDefault()}
              onClick={() => commitColor(color)}
            >
              {color}
            </Button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
