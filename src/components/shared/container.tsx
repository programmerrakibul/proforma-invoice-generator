import { cn } from "cn";

const Container = ({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) => {
  return (
    <div
      className={cn(
        "container mx-auto px-5 md:px-7 py-2.5 w-full overflow-hidden",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default Container;
