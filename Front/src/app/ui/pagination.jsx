import * as React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/app/ui/button";

const Pagination = ({ quotesPerPage, totalQuotes, paginate, currentPage }) => {
  const pageNumbers = [];

  // Cálculo del número total de páginas
  for (let i = 1; i <= Math.ceil(totalQuotes / quotesPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <nav role="navigation" aria-label="pagination" className="mx-auto flex w-full justify-center mt-4">
      <ul className="flex flex-row items-center gap-1">
        {/* Botón Anterior */}
        {currentPage > 1 && (
          <PaginationPrevious onClick={() => paginate(currentPage - 1)} />
        )}

        {/* Números de página */}
        {pageNumbers.map((number) => (
          <PaginationItem key={number}>
            <PaginationLink
              isActive={currentPage === number}
              onClick={() => paginate(number)}
            >
              {number}
            </PaginationLink>
          </PaginationItem>
        ))}

        {/* Botón Siguiente */}
        {currentPage < pageNumbers.length && (
          <PaginationNext onClick={() => paginate(currentPage + 1)} />
        )}
      </ul>
    </nav>
  );
};

const PaginationItem = React.forwardRef(({ className, ...props }, ref) => (
  <li ref={ref} className={cn("", className)} {...props} />
));
PaginationItem.displayName = "PaginationItem";

const PaginationLink = ({ className, isActive, size = "icon", ...props }) => (
  <a
    aria-current={isActive ? "page" : undefined}
    className={cn(
      buttonVariants({
        variant: isActive ? "outline" : "ghost",
        size,
      }),
      className
    )}
    {...props}
  />
);
PaginationLink.displayName = "PaginationLink";

const PaginationPrevious = ({ className, ...props }) => (
  <PaginationLink
    aria-label="Go to previous page"
    size="default"
    className={cn("gap-1 pl-2.5", className)}
    {...props}
  >
    <ChevronLeft className="h-4 w-4" />
    <span>Previous</span>
  </PaginationLink>
);
PaginationPrevious.displayName = "PaginationPrevious";

const PaginationNext = ({ className, ...props }) => (
  <PaginationLink
    aria-label="Go to next page"
    size="default"
    className={cn("gap-1 pr-2.5", className)}
    {...props}
  >
    <span>Next</span>
    <ChevronRight className="h-4 w-4" />
  </PaginationLink>
);
PaginationNext.displayName = "PaginationNext";

export { Pagination, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext };
