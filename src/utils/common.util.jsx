// eslint-disable-next-line import/no-extraneous-dependencies
import CryptoJS from "crypto-js";
import { NAME_KEY } from "../config/app.config";

export const getLocalStorageUser = () => {
  const token = localStorage.getItem(`${NAME_KEY}:userDetail`);
  if (token) {
    const bytes = CryptoJS.AES.decrypt(token, `${NAME_KEY}-userDetail`);
    return bytes.toString(CryptoJS.enc.Utf8);
  }
  return false;
};

export const stripHtml = (html) => {
  return html.replace(/<\/?[^>]+(>|$)/g, ""); // Removes all HTML tags
};

export const normalizedText = (text) => {
  // Replace all commas with a space
  const noCommas = text.replace(/,/g, " ");
  // Replace all occurrences of '&amp;' with '&'
  let cleanText = noCommas.replace(/&amp;/g, "&");
  cleanText = cleanText.replace(/&lt;/g, "<");
  cleanText = cleanText.replace(/&gt;/g, ">");
  cleanText = cleanText.replace(/&quot;/g, '"');

  return cleanText;
};

export const decodeHtmlEntities = (str) => {
  const txt = document.createElement("textarea");
  txt.innerHTML = str;
  return normalizedText(txt.value);
};

// This is a common function for data searching from frontend. it will no use when search , filter and pagination will handle from backend api.
export const searchDataFromJson = (query, searchBy, data) => {
  const regex = new RegExp(query, "i"); // Create a case-insensitive regex

  return data.filter((entry) => {
    return searchBy.some((field) => {
      // Check if the field exists in the entry and perform regex test
      if (Object.prototype.hasOwnProperty.call(entry, field)) {
        return regex.test(entry[field]);
      }
      return false; // If the field doesn't exist in the entry, return false
    });
  });
};

// This is a common function for data slicing from frontend. it will no use when search , filter and pagination will handle from backend api.
export const paginateData = (data, page, sizePerPage) => {
  // Validate parameters
  if (!Array.isArray(data)) {
    throw new Error("Data must be an array.");
  }

  if (page < 1 || sizePerPage < 1) {
    throw new Error("Page and sizePerPage must be greater than 0.");
  }

  // if data length is less than sizePerPage
  if (data?.length <= sizePerPage) {
    return data;
  }

  const startIndex = Number(page - 1) * sizePerPage;
  const endIndex = startIndex + Number(sizePerPage);

  // Slice the data for the current page
  const currentData = data.slice(startIndex, endIndex);
  return currentData;
};

// This is a common function for data sorting from frontend. it will no use when search , filter and pagination will handle from backend api.
export const sortJsonArray = (data, sortKey, order = "asc") => {
  // Validate the order parameter
  if (order !== "asc" && order !== "desc") {
    throw new Error("Order must be 'asc' or 'desc'");
  }

  // Determine the sorting direction
  const isDescending = order === "desc";

  // Sort the array based on the specified key
  return data.sort((a, b) => {
    if (a[sortKey] < b[sortKey]) {
      return isDescending ? 1 : -1;
    }
    if (a[sortKey] > b[sortKey]) {
      return isDescending ? -1 : 1;
    }
    return 0; // If equal
  });
};

export const filterDataFromJson = (filterObj, data) => {
  return data.filter((entry) => {
    return Object.keys(filterObj).every((key) => {
      // Handle case-insensitive search for string fields
      if (typeof entry[key] === "string") {
        return entry[key].toLowerCase() === filterObj[key].toLowerCase();
      }
      // Handle exact matches for other types (like numbers)
      return entry[key] === filterObj[key];
    });
  });
};

export const transformData = (data) => {
  const transformedData = { groups: {}, dropdownList: [] };

  const uniqueResponseTypes = [
    ...new Set(data.map((item) => item.responseType)),
  ];

  // eslint-disable-next-line no-shadow
  uniqueResponseTypes.forEach((responseType, index) => {
    // Filter responses by type
    const responses = data.filter((item) => item.responseType === responseType);

    // Map the responses to the required format
    transformedData.groups[responseType] = responses.map(
      ({
        responseName,
        scale,
        responseWeightage,
        responseCategory,
        isOEQ,
        oeqQuestion,
      }) => ({
        responseName,
        scale,
        responseWeightage,
        responseCategory,
        isOEQ,
        oeqQuestion,
      })
    );

    // Add to dropdown list
    transformedData.dropdownList.push({
      id: index + 1,
      label: responseType,
      value: responseType,
    });
  });

  return transformedData;
};
// this function help to convert html to plain text
export const htmlToPlainText = (html) => {
  // Create a temporary DOM element
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = html;

  // Extract and return the plain text
  return tempDiv.textContent || tempDiv.innerText || "";
};

export const formatDate = (inputDate) => {
  if (!inputDate) {
    return "";
  }

  if (!(inputDate instanceof Date)) {
    inputDate = new Date(inputDate); // Convert to Date object if input is a string
  }

  // eslint-disable-next-line no-restricted-globals
  if (isNaN(inputDate)) {
    throw new Error("Invalid date format");
  }

  const day = String(inputDate.getDate()).padStart(2, "0"); // Add leading zero for day
  const month = String(inputDate.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const year = inputDate.getFullYear();

  return `${month}-${day}-${year}`;
};

export const formatDateQuestionSetUP = (dateString) => {
  const date = new Date(dateString);
  const options = {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  };

  // const formattedDate = date.toLocaleString("en-US", options);
  // return `${formattedDate.replace(",", "")} At ${formattedDate.split(", ")[1]}`;

  const formattedDate = date.toLocaleString("en-US", options); // Dec 10, 2024, 12:00 AM
  console.log('===>'+formattedDate);
  const parts = formattedDate.split(", ");                     // ["Dec 10", "2024", "12:00 AM"]
  return `${parts[0]}, ${parts[1]}, At ${parts[2]}`;
};

export const buildHierarchy = (levels, levelData) => {
  const levelMap = Object.fromEntries(levels.map((l) => [l.value, l.label]));

  function createFilters(level, parentValue = "") {
    const levelEntry = levelData.find((l) => l.keyLevel === level);
    console.log(levelEntry,"levelEntry");
    // const displayName = levelEntry?.levelName;
    if (!levelEntry) return [];
    console.log(levelData, "levelData 33");
    console.log(level, "level33");

    return levelEntry.data
      .filter((item) => (parentValue ? item.relatedTo === parentValue : true))
      .map((item) => {
        console.log(item, "levelName");
        let filter = { value: item.response };
        const nextLevel = levels.find((l) => l.value === level + 1);
        if (nextLevel) {
          const nextFilters = createFilters(nextLevel.value, item.response);
          const leveldown = levelData.find((l) => l.keyLevel === nextLevel.value);
          if (nextFilters.length) {
            filter.nextLevel = {
              displayName:leveldown.levelName,
              level: nextLevel.value,
              filters: nextFilters,
            };
          }
        }
        return filter;
      });
  }

  return {
    displayName: levelData[0]?.levelName,
    level: 1,
    filters: createFilters(1),
  };
};

const convertHierarchyToLevels = (hierarchyString) => {
  return hierarchyString.split("->").map((label, index) => ({
    value: index + 1,
    label: `Level ${index + 1}`,
  }));
};

export const convertToLevelsAndLevelData = (apiData, hierarchyString) => {
  const levels = convertHierarchyToLevels(hierarchyString);
  const levelDataObj = {};

  // Initialize first level
  const processQueue = apiData.map((item) => ({
    ...item,
    level: 1,
    parentResponse: null,
  }));

  for (const item of processQueue) {
    // Initialize level array if it doesn't exist
    if (!levelDataObj[item.level]) {
      levelDataObj[item.level] = [];
    }

    // Add current item to its level
    levelDataObj[item.level].push({
      response: item.response,
      relatedTo: item.parentResponse,
    });

    // Process children if they exist
    if (item.nextLevel?.length > 0) {
      for (const child of item.nextLevel) {
        processQueue.push({
          ...child,
          level: item.level + 1,
          parentResponse: item.response,
        });
      }
    }
  }
  // Add s.no to each level starting from 1
  const levelData = Object.entries(levelDataObj).map(([keyLevel, data]) => {
  
    const integerVal = parseInt(keyLevel) ;
    const displayText = processQueue.find(ele => ele.level === integerVal)
    return {
    keyLevel: parseInt(keyLevel),
    data: data.map((item, index) => ({
      "s.no": index + 1,
      ...item,
    })),
    levelName: displayText ?  displayText.displayName : ''
    
  }
  });

  return { levelData, levels };
};

export const getChartTypeByID = (id, chartTypeOption, groupped) => {
  const chartTypeOptions=[...chartTypeOption,{value:1,label:'column'}]
  console.log(chartTypeOptions,id,"kkk")

  const foundType = chartTypeOptions.find((type) => type.value === id);
  if (!foundType) return "pie";

  // Shallow copy
  const chartType = { ...foundType };

  if (groupped) {
    if (chartType.label === "Bar") {
      chartType.label = "grouppedbar";
    } else if (chartType.label === "Line") {
      chartType.label = "grouppedline";
    } else if (chartType.label === "Scatter") {
      chartType.label = "grouppedscatter";
    } else if (chartType.label === "Combo") {
      chartType.label = "grouppedcombo";
    }
    else if (chartType.label === "Column") {
      chartType.label = "column";
    }
    else if (chartType.label === "Donut") {
      chartType.label = "donut";
    }
  }
  else{
    return chartType.label="bar"
  }

  return chartType.label?.toLowerCase() || "donut";
};

export  const processCrosstabData = (data) => {
  if (!data) return [];

  let processedData = [];
  let counter = 1;

  data.forEach((item) => {
    // For branched questions, include level in question name
    const questionText = item.is_branch
      ? `${item.question} (Level ${item.filter_level})`
      : item.question;

    // Create a row for each response
    item.responses.forEach((response, index) => {
      processedData.push({
        number: index === 0 ? counter++ : '', // Only show number in first row
        question: index === 0 ? questionText : '', // Only show question in first row
        response_name: response.response_name,
        response_user_count: response.response_user_count,
        total_user_count: response.total_user_count,
        percentage: `${response.response_percentage}%`,
        rowspan: index === 0 ? item.responses.length : 0 // Set rowspan for first row only
      });
    });
  });

  return processedData;
};
export const crosstabColumns = [
  {
    title: "#",
    dataKey: "number",
    data: "number",
    columnHeaderClassName: "no-sorting w-1 text-center",
  },
  {
    title: "Question",
    dataKey: "question",
    data: "question",
    columnHeaderClassName: "no-sorting",
    rowspan: (row) => row.rowspan || 1
  },
  {
    title: "Response",
    dataKey: "response_name",
    data: "response_name",
    columnHeaderClassName: "no-sorting",
  },
  {
    title: "Count",
    dataKey: "response_user_count",
    data: "response_user_count",
    columnHeaderClassName: "no-sorting text-center",
  },
  {
    title: "Total",
    dataKey: "total_user_count",
    data: "total_user_count",
    columnHeaderClassName: "no-sorting text-center",
  },
  {
    title: "%",
    dataKey: "percentage",
    data: "percentage",
    columnHeaderClassName: "no-sorting text-center",
  },
];

export const getLgendsByID = (id, legendOptions) => {
  const found = legendOptions.find((type) => type.value === id);
  if (found) return found.label?.toLowerCase();

  try {
    const stored = JSON.parse(localStorage.getItem("chartOptions"));
    const fallbackId = stored?.legendPosition;
    const fallback = legendOptions.find((type) => type.value === fallbackId);
    return fallback?.label?.toLowerCase() || "bottom";
  } catch {
    return "bottom";
  }
};


export function transformDataAggregate(data) {
  console.log("Transform agg data: ", data)
  const category = data.map((item) => (item?.info_name=="Aggregate")?"Survey aggregate":  item.info_name === "Department Overall" ? "Overall" : item.info_name);
  const value = data.map((item) => ({"Survey Aggregate":item.value}));
  console.log("CATEGORY VALUE: ", category, value)
  return { category, value };
}

export const getDataLabelsByID = (id, dataLabelOptions) => {
  const found = dataLabelOptions.find(
    (type) =>
      String(type.value) === String(id) || type.label?.toLowerCase() === String(id).toLowerCase()
  );

  if (found) return found?.label?.toLowerCase() ?? null;


  try {
    const stored = JSON.parse(localStorage.getItem("chartOptions"));
    const fallbackId = stored?.labelPosition;
    const fallback = dataLabelOptions.find((type) => type.value === fallbackId);
    return fallback?.label?.toLowerCase() || "top";
  } catch {
    return "top";
  }
};

export const getFontOptionsByID = (id, fontSizeOptions) => {
  const found = fontSizeOptions.find((type) => type.value === id);
  if (found) return found.label?.toLowerCase();

  try {
    const stored = JSON.parse(localStorage.getItem("chartOptions"));
    const fallbackId = stored?.fontSize;
    const fallback = fontSizeOptions.find((type) => type.value === fallbackId);
    return fallback?.label?.toLowerCase() || "12";
  } catch {
    return "12";
  }
};


export function transformOutcomeData(categories, values) {
  if (categories.length !== values.length) {
    throw new Error("Mismatched lengths of outcomeCategories and outcomeValues");
  }

  const outcomeKeys = Object.keys(values[0]); // e.g., ["Test-Outcome 1-707", "Test-Outcome 2-707"]
  const transformedValues = outcomeKeys.map((outcomeKey) => {
    const result = {};
    values.forEach((value, index) => {
      const label = categories[index]=="Aggregate"?`Survey Aggregate`:`${categories[index]}`; // ensure uniqueness with index
      result[label] = value[outcomeKey];
    });
    return result;
  });
  console.log('transforming',transformedValues)

  return {
    outcomeCategories: outcomeKeys,
    outcomeValues: transformedValues
  };
}



// eslint-disable-next-line no-shadow
export function revertOutcomeData(groupedCategories, groupedValues) {
  const {length} = Object.keys(groupedValues[0]);
  // eslint-disable-next-line no-shadow
  const categories = [];
  // eslint-disable-next-line no-shadow
  const values = Array.from({ length }, () => ({}));

  groupedCategories.forEach((outcomeKey, outcomeIndex) => {
    const group = groupedValues[outcomeIndex];
    Object.entries(group).forEach(([labelWithIndex, val], idx) => {
      const match = labelWithIndex.match(/^(.+)_\d+$/);
      const originalLabel = match ? match[1] : labelWithIndex;
      categories[idx] = originalLabel;
      values[idx][outcomeKey] = val;
    });
  });

  return {
    outcomeCategories: categories,
    outcomeValues: values
  };
}
