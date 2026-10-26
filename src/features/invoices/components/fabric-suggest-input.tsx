import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fabrics } from "@/data/fabrics";
import { useEffect, useRef, useState, type JSX } from "react";

interface FabricSuggestInputProps {
  id: string;
  value: string;
  invalid: boolean;
  onCommit: (value: string) => void;
  onDraft: () => void;
}

const fabricOptions: string[] = Array.from(
  new Set(fabrics.map((item) => item.fabric)),
);

function FabricSuggestInput({
  id,
  value,
  invalid,
  onCommit,
  onDraft,
}: FabricSuggestInputProps): JSX.Element {
  const [query, setQuery] = useState<string>(value);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [hasTyped, setHasTyped] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const listboxId = `${id}-options`;
  const normalizedQuery = query.trim().toLocaleLowerCase();
  const matches = hasTyped
    ? fabricOptions.filter((fabric) =>
        fabric.toLocaleLowerCase().includes(normalizedQuery),
      )
    : fabricOptions;
  const exactMatch = fabricOptions.some(
    (fabric) => fabric.toLocaleLowerCase() === normalizedQuery,
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

  const commitFabric = (fabric: string): void => {
    setQuery(fabric);
    setHasTyped(false);
    setIsOpen(false);
    onCommit(fabric);
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
        className="h-10 rounded-lg bg-background"
        placeholder="Search or enter a fabric"
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
          aria-label="Fabric suggestions"
          className="absolute inset-x-0 top-full z-20 mt-1 flex max-h-56 flex-col gap-1 overflow-y-auto rounded-lg border border-border bg-popover p-1 shadow-md"
        >
          {hasTyped && query.trim() && !exactMatch ? (
            <Button
              type="button"
              variant="secondary"
              role="option"
              aria-selected="false"
              className="h-auto justify-start px-3 py-2 text-left text-sm"
              onPointerDown={(event) => event.preventDefault()}
              onClick={() => commitFabric(query.trim())}
            >
              Use custom fabric: {query.trim()}
            </Button>
          ) : null}
          {matches.map((fabric) => (
            <Button
              key={fabric}
              type="button"
              variant="ghost"
              role="option"
              aria-selected={fabric === value}
              className="h-auto justify-start px-3 py-2 text-left text-sm"
              onPointerDown={(event) => event.preventDefault()}
              onClick={() => commitFabric(fabric)}
            >
              {fabric}
            </Button>
          ))}
          {matches.length === 0 && !(hasTyped && query.trim()) ? (
            <p className="px-3 py-2 text-sm text-muted-foreground">
              No catalog fabrics match.
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

export default FabricSuggestInput;
