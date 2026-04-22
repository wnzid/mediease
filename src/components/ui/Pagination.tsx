type PaginationProps = {
  currentPage: number;
  totalPages: number;
};

export function Pagination({ currentPage, totalPages }: PaginationProps) {
  return (
    <nav aria-label="Pagination" className="flex items-center justify-between gap-3 text-sm text-[var(--color-ink-700)]">
      <span>
        Page {currentPage} of {totalPages}
      </span>
      <div className="flex gap-2">
        <button
          type="button"
          disabled={currentPage === 1}
          className="h-[var(--size-control-sm)] rounded-full border border-[var(--color-panel-border)] px-3.5 disabled:opacity-50"
        >
          Previous
        </button>
        <button
          type="button"
          disabled={currentPage === totalPages}
          className="h-[var(--size-control-sm)] rounded-full border border-[var(--color-panel-border)] px-3.5 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </nav>
  );
}
