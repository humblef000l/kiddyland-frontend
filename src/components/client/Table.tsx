"use client"
import type React from "react"
import { useState, useMemo, useEffect } from "react"
import clsx from "clsx"
import { TSortDirection, TTableProps } from "@/types/tableTypes"



export function Table<T extends Record<string, any>>({
  data,
  columns,
  striped = false,
  bordered = false,
  hoverable = false,
  fullWidth = true,
  className,
  tableClassName,
  headerClassName,
  rowClassName,
  cellClassName,
  pageSize = 10,
  defaultSortKey,
  defaultSortOrder = "asc",
  onRowClick,
  noDataMessage = "No data available",
  showPagination = true,
  initialPage = 1,
  onPageChange,
  onSort,
  manualSort = false,
  manualPagination = false,
  totalCount,
  loading = false,
  loadingComponent = <div className="p-4 text-center">Loading...</div>,
  stickyHeader = false,
}: TTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(initialPage)
  const [sortKey, setSortKey] = useState<keyof T | null>(defaultSortKey || null)
  const [sortOrder, setSortOrder] = useState<TSortDirection>(defaultSortOrder)

  // Reset to page 1 when data changes if not using manual pagination
  useEffect(() => {
    if (!manualPagination && currentPage !== 1) {
      setCurrentPage(1)
    }
  }, [data, manualPagination])

  // Update current page when initialPage prop changes
  useEffect(() => {
    if (initialPage !== currentPage) {
      setCurrentPage(initialPage)
    }
  }, [initialPage])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    onPageChange?.(page)
  }

  const sortedData = useMemo(() => {
    if (manualSort || !sortKey) return data

    const sortedData =  [...data].sort((a, b) => {
      const aValue = a[sortKey]
      const bValue = b[sortKey]

      // Handle null/undefined values
      if (aValue == null && bValue == null) return 0
      if (aValue == null) return sortOrder === "asc" ? -1 : 1
      if (bValue == null) return sortOrder === "asc" ? 1 : -1

      // Handle different types
      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortOrder === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
      }

      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1
      return 0
    })
    console.log("sorted data: ",sortedData);
    return sortedData;
  }, [data, sortKey, sortOrder, manualSort])

  const paginatedData = useMemo(() => {
    if (manualPagination) return data

    const start = (currentPage - 1) * pageSize
    return sortedData.slice(start, start + pageSize)
  }, [sortedData, currentPage, pageSize, manualPagination, data])

  const totalPages = useMemo(() => {
    const count = totalCount ?? data.length
    return Math.max(1, Math.ceil(count / pageSize))
  }, [data.length, pageSize, totalCount])

  const handleSort = (key: keyof T) => {
    debugger
    const newSortOrder = sortKey === key && sortOrder === "asc" ? "desc" : "asc"
    setSortKey(key)
    setSortOrder(newSortOrder)

    if (onSort) {
      onSort(key, newSortOrder)
    }
  }

  const visibleColumns = columns.filter((col) => !col.hide)

  return (
    <div className={clsx("flex flex-col gap-4 min-h-[128px]", className)}>
      <div className={clsx("overflow-auto relative", { "w-full": fullWidth })}>
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/100 z-10">{loadingComponent}</div>
        )}
        <table className={clsx("text-left text-sm border-collapse min-w-full", tableClassName)}>
          <thead className={clsx(stickyHeader && "sticky top-0", headerClassName)}>
            <tr>
              {visibleColumns.map(({ key, header, sortable, width, align = "left" }) => (
                <th
                  key={key as string}
                  onClick={() => sortable && handleSort(key)}
                  className={clsx(
                    "px-4 py-2 bg-gray-100 text-gray-700 font-semibold border-b",
                    sortable ? "cursor-pointer select-none hover:bg-gray-200" : "",
                    {
                      "text-left": align === "left",
                      "text-center": align === "center",
                      "text-right": align === "right",
                    },
                  )}
                  style={width ? { width } : undefined}
                >
                  <div className="flex items-center gap-1 w-full justify-start">
                    {header}
                    {sortable && sortKey === key && <span className="ml-1">{sortOrder === "asc" ? "↑" : "↓"}</span>}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  onClick={() => onRowClick && onRowClick(row, rowIndex)}
                  className={clsx(
                    {
                      "bg-gray-50": striped && rowIndex % 2 === 1,
                      "hover:bg-gray-100": hoverable,
                      "cursor-pointer": !!onRowClick,
                    },
                    rowClassName && rowClassName(row, rowIndex),
                  )}
                >
                  {visibleColumns.map(({ key, render, align = "left" }) => (
                    <td
                      key={key as string}
                      className={clsx(
                        "px-4 py-2 border-b",
                        { border: bordered },
                        {
                          "text-left": align === "left",
                          "text-center": align === "center",
                          "text-right": align === "right",
                        },
                        cellClassName && cellClassName(row[key], row, key),
                      )}
                    >
                      {render ? render(row[key], row, rowIndex) : row[key]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={visibleColumns.length} className="px-4 py-4 text-center text-gray-500">
                  {noDataMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {showPagination && totalPages > 1 && (
        <div className="flex justify-between items-center gap-2">
          <div className="text-sm text-gray-500">
            {manualPagination && totalCount
              ? `Showing ${Math.min((currentPage - 1) * pageSize + 1, totalCount)} to ${Math.min(currentPage * pageSize, totalCount)} of ${totalCount} entries`
              : `Showing ${Math.min((currentPage - 1) * pageSize + 1, data.length)} to ${Math.min(currentPage * pageSize, data.length)} of ${data.length} entries`}
          </div>
          <div className="flex items-center gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => handlePageChange(1)}
              className="px-2 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              ««
            </button>
            <button
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              «
            </button>

            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              // Show pages around current page
              let pageNum = currentPage
              const offset = Math.floor(Math.min(5, totalPages) / 2)

              if (currentPage <= offset) {
                pageNum = i + 1
              } else if (currentPage > totalPages - offset) {
                pageNum = totalPages - Math.min(5, totalPages) + i + 1
              } else {
                pageNum = currentPage - offset + i
              }

              if (pageNum > totalPages) return null

              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={clsx(
                    "px-3 py-1 rounded",
                    currentPage === pageNum ? "bg-blue-500 text-white" : "bg-gray-200 hover:bg-gray-300",
                  )}
                >
                  {pageNum}
                </button>
              )
            })}

            <button
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              »
            </button>
            <button
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(totalPages)}
              className="px-2 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              »»
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

