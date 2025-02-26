import * as React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { cn } from "../../lib/utils";

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger> & {
    children?: React.ReactNode | ((open: boolean) => React.ReactNode);
  }
>(({ className, children, ...props }, ref) => {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        ref={ref}
        className={cn("flex flex-1 items-center justify-between py-4", className)}
        {...props}
      >
        {typeof children === "function" ? 
          <AccordionContentState value={props.value as string}>
            {(open) => children(open)}
          </AccordionContentState> 
          : 
          children
        }
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
});

AccordionTrigger.displayName = "AccordionTrigger";

// Hilfskomponente zum Erfassen des Zustands
const AccordionContentState = ({ 
  children, 
  value 
}: { 
  children: (open: boolean) => React.ReactNode;
  value: string;
}) => {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const accordion = document.querySelector(`[data-state][data-value="${value}"]`);
    setOpen(accordion?.getAttribute('data-state') === 'open');

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'data-state') {
          setOpen((mutation.target as Element).getAttribute('data-state') === 'open');
        }
      });
    });

    if (accordion) {
      observer.observe(accordion, { attributes: true });
    }

    return () => observer.disconnect();
  }, [value]);

  return <>{children(open)}</>;
};

export { AccordionTrigger };