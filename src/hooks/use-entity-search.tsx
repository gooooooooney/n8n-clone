
import { PAGINATION } from "@/config/constants";
import { useEffect, useState } from "react";

interface UseEntitySearchProps<T extends {
  search: string;
  page: number
}> {
  params: T;
  setParams: (newParams: T) => void;
  debounceMs?: number;
}
export const useEntitySearch = <T extends {
  search: string;
  page: number
}
>({
  params,
  setParams,
  debounceMs = 500
}: UseEntitySearchProps<T>) => {
  const [localSearch, setLocalSearch] = useState("")

  useEffect(() => {
    if (localSearch === "" && params.search !== "") {
      setParams({
        ...params,
        search: "",
        page: PAGINATION.DEFAULT_PAGE
      })
      return
    }

    const timer = setTimeout(() => {
      if (localSearch !== params.search) {
        setParams({
          ...params,
          search: localSearch,
          page: PAGINATION.DEFAULT_PAGE
        })
      }
    }, debounceMs)

    return () => clearTimeout(timer)
  }, [localSearch, debounceMs, params, setParams])

  useEffect(() => {
    setLocalSearch(params.search)
  }, [params.search])

  return {
    searchValue: localSearch,
    onSearchChange: setLocalSearch
  }
}