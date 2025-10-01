// hooks/useTable.js

import { useState, useEffect } from "react";
import {
  paginateData,
  searchDataFromJson,
  sortJsonArray,
  filterDataFromJson,
} from "../../utils/common.util";

export function useTable({
  searchValue,
  initialLimit,
  data,
  tableFilters,
  searchKeys,
}) {
  const [offset, setOffset] = useState(1);
  const [limit, setLimit] = useState(initialLimit);
  const [currentData, setCurrentData] = useState([]);
  const [totalRecords, setTotalRecords] = useState(data?.length || 0);
  const [totalPages, setTotalPages] = useState(
    Math.ceil(data?.length / initialLimit) || 1
  );
  const [searchData, setSearchData] = useState([]);
  const [sortState, setSortState] = useState({});

  // Update data based on search, pagination, and limit
  useEffect(() => {
    let filteredData = data || [];
    if (searchValue !== "" && Object.keys(tableFilters).length !== 0) {
      filteredData = filterDataFromJson(tableFilters, data);
      filteredData = searchDataFromJson(searchValue, searchKeys, filteredData);
      setSearchData(filteredData);
    } else if (searchValue !== "") {
      filteredData = searchDataFromJson(searchValue, searchKeys, data);
      setSearchData(filteredData);
    } else if (Object.keys(tableFilters).length !== 0) {
      filteredData = filterDataFromJson(tableFilters, data);
      setSearchData(filteredData);
    } else {
      setSearchData([]);
    }

    const pageWiseData = paginateData(filteredData, offset, limit);
    setCurrentData(pageWiseData);
    setTotalRecords(filteredData.length);
    setTotalPages(Math.ceil(filteredData.length / limit));
    // Cleanup function to reset state when dependencies change or component unmounts
    return () => {
      // Reset states if necessary or handle cleanup tasks
      setSearchData([]);
      setCurrentData([]);
    };
  }, [searchValue, offset, limit, data, tableFilters]);

  // Handle sort functionality
  const handleSort = (columnKey, newSortOrder) => {
    const sortedData = sortJsonArray(currentData, columnKey, newSortOrder);
    setCurrentData(sortedData);
    setSortState({ [columnKey]: newSortOrder });
  };

  return {
    currentData,
    totalRecords,
    totalPages,
    offset,
    sortState,
    setOffset,
    setLimit,
    searchData,
    limit,
    handleSort,
  };
}

export function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return width;
}
