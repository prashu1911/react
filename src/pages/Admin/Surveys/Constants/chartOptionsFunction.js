export const switchAxisData = {
  dataTypeOne: {
    xaxisCategory: ["Overall", "User 1", "User 2"],
    data: [
      {
        name: "Outcome 1",
        data: [40, 40, 40],
        zIndex: 10,
      },
      {
        name: "Outcome 2",
        data: [30, 30, 30],
        zIndex: 10,
      },
      {
        name: "Outcome 3",
        data: [30, 30, 30],
        zIndex: 10,
      },
    ],
  },
  dataTypeTwo: {
    xaxisCategory: ["Outcome 1", "Outcome 2", "Outcome 3"],
    data: [
      {
        name: "Overall",
        data: [40, 40, 40],
        zIndex: 10,
      },
      {
        name: "User 1",
        data: [30, 30, 30],
        zIndex: 10,
      },
      {
        name: "User 2",
        data: [30, 30, 30],
        zIndex: 10,
      },
    ],
  },
};

export const scatterRenderDataTypes = {
  dataTypeOne: [
    {
      name: "Outcome A",
      data: [
        { x: "Overall", y: 40 },
        { x: "User 1", y: 50 },
        { x: "User 2", y: 70 },
      ],
    },
    {
      name: "Outcome B",
      data: [
        { x: "Overall", y: 30 },
        { x: "User 1", y: 60 },
        { x: "User 2", y: 90 },
      ],
    },
    {
      name: "Outcome C",
      data: [
        { x: "Overall", y: 30 },
        { x: "User 1", y: 60 },
        { x: "User 2", y: 90 },
      ],
    },
  ],
  dataTypeTwo: [
    {
      name: "Overall",
      data: [
        { x: "Outcome A", y: 40 },
        { x: "Outcome B", y: 50 },
        { x: "Outcome C", y: 70 },
      ],
    },
    {
      name: "User 1",
      data: [
        { x: "Outcome A", y: 30 },
        { x: "Outcome B", y: 60 },
        { x: "Outcome C", y: 90 },
      ],
    },
    {
      name: "User 2",
      data: [
        { x: "Outcome A", y: 30 },
        { x: "Outcome B", y: 60 },
        { x: "Outcome C", y: 90 },
      ],
    },
  ],
};

const updateBarOptions = (chartOptions, inputObj) => {
  return {
    ...chartOptions,
    legend: {
      ...chartOptions.legend,
      position: inputObj.legend === "hidden" ? "left" : inputObj.legend,
      show: inputObj.legend !== "hidden",
    },
    dataLabels: {
      ...chartOptions.dataLabels,
      enabled: inputObj.dataLabel !== "none",
      position: inputObj.dataLabel || "top",
      style: {
        ...chartOptions.dataLabels.style,
        fontSize: `${inputObj.fontsize || 8}px`,
        colors: [inputObj.labelColor || "#000000"],
      },
    },
    annotations: {
      ...chartOptions.annotations,
      xaxis: [...chartOptions.annotations.xaxis].map((item) => ({
        ...item,
        opacity: inputObj.scalarOpacity,
      })),
      yaxis: []
    },
    xaxis: {
      ...chartOptions.xaxis,
      categories: inputObj.switchaxis
        ? switchAxisData.dataTypeOne.xaxisCategory
        : switchAxisData.dataTypeTwo.xaxisCategory,
    },
  };
};

const updateColumnOptions = (chartOptions, inputObj) => {
  return {
    ...chartOptions,
    legend: {
      ...chartOptions.legend,
      position: inputObj.legend === "hidden" ? "left" : inputObj.legend,
      show: inputObj.legend !== "hidden",
    },
    dataLabels: {
      ...chartOptions.dataLabels,
      enabled: inputObj.dataLabel !== "none",
      position: inputObj.dataLabel || "top",
      style: {
        ...chartOptions.dataLabels.style,
        fontSize: `${inputObj.fontsize || 8}px`,
        colors: [inputObj.labelColor || "#000000"],
      },
    },
    annotations: {
      ...chartOptions.annotations,
      yaxis: [...chartOptions.annotations.yaxis].map((item) => ({
        ...item,
        opacity: inputObj.scalarOpacity,
      })),
      xaxis: []
    },
    xaxis: {
        ...chartOptions.xaxis,
        categories: inputObj.switchaxis
          ? switchAxisData.dataTypeOne.xaxisCategory
          : switchAxisData.dataTypeTwo.xaxisCategory,
      },
  };
};

const updateLineOptions = (chartOptions, inputObj) => {
  return {
    ...chartOptions,
    legend: {
      ...chartOptions.legend,
      position: inputObj.legend === "hidden" ? "left" : inputObj.legend,
      show: inputObj.legend !== "hidden",
    },
    dataLabels: {
      ...chartOptions.dataLabels,
      enabled: inputObj.dataLabel !== "none",
      position: inputObj.dataLabel || "top",
      style: {
        ...chartOptions.dataLabels.style,
        fontSize: `${inputObj.fontsize || 8}px`,
        colors: [inputObj.labelColor || "#000000"],
      },
    },
    annotations: {
      ...chartOptions.annotations,
      yaxis: [...chartOptions.annotations.yaxis].map((item) => ({
        ...item,
        opacity: inputObj.scalarOpacity,
      })),
      xaxis: []
    },
    xaxis: {
        ...chartOptions.xaxis,
        categories: inputObj.switchaxis
          ? switchAxisData.dataTypeOne.xaxisCategory
          : switchAxisData.dataTypeTwo.xaxisCategory,
      },
  };
};

const updateScatterOptions = (chartOptions, inputObj) => {
  return {
    ...chartOptions,
    legend: {
      ...chartOptions.legend,
      position: inputObj.legend === "hidden" ? "left" : inputObj.legend,
      show: inputObj.legend !== "hidden",
    },
    dataLabels: {
      ...chartOptions.dataLabels,
      enabled: inputObj.dataLabel !== "none",
      position: inputObj.dataLabel || "top",
      style: {
        ...chartOptions.dataLabels.style,
        fontSize: `${inputObj.fontsize || 8}px`,
        colors: [inputObj.labelColor || "#000000"],
      },
    },
    annotations: {
      ...chartOptions.annotations,
      yaxis: [...chartOptions.annotations.yaxis].map((item) => ({
        ...item,
        opacity: inputObj.scalarOpacity,
      })),
      xaxis: []
    },
    xaxis: {
        ...chartOptions.xaxis,
        categories: inputObj.switchaxis
          ? switchAxisData.dataTypeOne.xaxisCategory
          : switchAxisData.dataTypeTwo.xaxisCategory,
      },
  };
};

const updateRadarOptions = (chartOptions, inputObj) => {
  return {
    ...chartOptions,
    legend: {
      ...chartOptions.legend,
      position: inputObj.legend === "hidden" ? "left" : inputObj.legend,
      show: inputObj.legend !== "hidden",
    },
    dataLabels: {
      ...chartOptions.dataLabels,
      enabled: inputObj.dataLabel !== "none",
    //   position: inputObj.dataLabel || "top",
      style: {
        ...chartOptions.dataLabels.style,
        fontSize: `${inputObj.fontsize || 8}px`,
        colors: [inputObj.labelColor || "#000000"],
      },
    },
      annotations: {
          ...chartOptions.annotations,
          yaxis: [],
          xaxis: []
      },
    xaxis: {
        ...chartOptions.xaxis,
        categories: inputObj.switchaxis
          ? switchAxisData.dataTypeOne.xaxisCategory
          : switchAxisData.dataTypeTwo.xaxisCategory,
      },
  };
};

 export const updateChartOptions = (chartType, chartOptions, formData) => {
  let chartValue =
    typeof chartType === "string" ? chartType.toLowerCase() : "bar";
  let updatedOption = {};
  const inputObj = {
    legend: formData.summary_legend_position.value
      ? formData.summary_legend_position.value.toLowerCase()
      : "bottom",
    fontsize: formData.summary_font_size.value ?? "8px",
    dataLabel: formData.summary_data_label.value
      ? formData.summary_data_label.value.toLowerCase()
      : "top",
    scalarOpacity: formData.summary_scalar_opacity
      ? (formData.summary_scalar_opacity / 100).toFixed(1)
      : 0.1,
    switchaxis: formData.summary_switch_axis,
    labelColor: formData.detail_db_color
      ? formData.summary_db_color
      : ["#000"],
  };

  switch (chartValue) {
    case "bar":
      updatedOption = updateBarOptions(chartOptions, inputObj);
      break;

    case "column":
      updatedOption = updateColumnOptions(chartOptions, inputObj);
      break;
    case "line":
      updatedOption = updateLineOptions(chartOptions, inputObj);
      break;
    case "radar":
      updatedOption = updateRadarOptions(chartOptions, inputObj);
      break;
    case "scatter":
      updatedOption = updateScatterOptions(chartOptions, inputObj);
      break;

    default:
      break;
  }

  return updatedOption;
};

export const updateChartOptionsRD = (chartType, chartOptions, formData) => {
    let chartValue =
      typeof chartType === "string" ? chartType.toLowerCase() : "bar";
    let updatedOption = {};
    const inputObj = {
      legend: formData.detail_legend_position.value
        ? formData.detail_legend_position.value.toLowerCase()
        : "bottom",
      fontsize: formData.detail_font_size.value ?? "8px",
      dataLabel: formData.detail_data_label.value
        ? formData.detail_data_label.value.toLowerCase()
        : "top",
      scalarOpacity: formData.detail_scalar_opacity
        ? (formData.detail_scalar_opacity / 100).toFixed(1)
        : 0.1,
      switchaxis: formData.detail_switch_axis,
      labelColor: formData.detail_db_color
        ? formData.detail_db_color
        : ["#000"],
    };
  
    switch (chartValue) {
      case "bar":
        updatedOption = updateBarOptions(chartOptions, inputObj);
        break;
  
      case "column":
        updatedOption = updateColumnOptions(chartOptions, inputObj);
        break;
      case "line":
        updatedOption = updateLineOptions(chartOptions, inputObj);
        break;
      case "radar":
        updatedOption = updateRadarOptions(chartOptions, inputObj);
        break;
      case "scatter":
        updatedOption = updateScatterOptions(chartOptions, inputObj);
        break;
  
      default:
        break;
    }
  
    return updatedOption;
  };

export const updateDataSeries = (switchaxis,type) => {
    const chartType = typeof type === 'string' ? type.toLowerCase() : 'bar';

    if (chartType === 'scatter') {
        return switchaxis ? scatterRenderDataTypes.dataTypeOne : scatterRenderDataTypes.dataTypeTwo
    } else {
        return switchaxis ? switchAxisData.dataTypeOne.data : switchAxisData.dataTypeTwo.data
    }
}
