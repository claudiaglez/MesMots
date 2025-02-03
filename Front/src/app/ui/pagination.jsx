import * as React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "../../components/ui/Button"

const Pagination = ({ quotesPerPage, totalQuotes, paginate, currentPage }) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalQuotes / quotesPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <nav role="navigation" aria-label="pagination" className="mx-auto flex w-full justify-center mt-4">
      <ul className="flex flex-row items-center gap-1" role="list">
        {currentPage > 1 && (
          <PaginationPrevious onClick={() => paginate(currentPage - 1)} />
        )}

        {pageNumbers.map((number) => (
          <PaginationItem key={number} role="listitem">
            <PaginationLink
              isActive={currentPage === number}
              onClick={() => paginate(number)}
            >
              {number}
            </PaginationLink>
          </PaginationItem>
        ))}

        {currentPage < pageNumbers.length && (
          <PaginationNext onClick={() => paginate(currentPage + 1)} />
        )}
      </ul>
    </nav>
  );
};

const PaginationItem = React.forwardRef(({ className, ...props }, ref) => (
  <li ref={ref} className={cn("cursor-pointer text-darkPink", className)} {...props} />
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
      isActive ? "border-2 border-darkPink" : "",  
      className
    )}
    {...props}
  />
);
PaginationLink.displayName = "PaginationLink";

const PaginationPrevious = ({ className, ...props }) => (
  <PaginationLink
    aria-label="Go to previous page"
    aria-disabled={currentPage <= 1}
    size="default"
    className={cn("gap-1 pl-2.5 font-lifeSavers font-bold cursor-pointer text-darkPink", className)}
    disabled={currentPage <= 1}
    {...props}
  >
    <ChevronLeft className="h-4 w-4" />
    <span>Précedent</span>
  </PaginationLink>
);
PaginationPrevious.displayName = "PaginationPrevious";

const PaginationNext = ({ className, ...props }) => (
  <PaginationLink
    aria-label="Go to next page"
    aria-disabled={currentPage >= totalPages}
    size="default"
    className={cn("gap-1 pr-2.5 font-lifeSavers font-bold cursor-pointer text-darkPink", className)}
    disabled={currentPage >= totalPages}
    {...props}
  >
    <span>Suivante</span>
    <ChevronRight className="h-4 w-4" />
  </PaginationLink>
);
PaginationNext.displayName = "PaginationNext";

export { Pagination, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext };
