export const statusFormatter = (cell) => {
  const statusMapping = {
    success: "status-active",
    danger: "status-paused",
    warning: "status-warning",
    info: "status-unassign",
    primary: "status-draft",
    secondary: "status-closed",
  };

  const statusArr = {
    Active: "Active",
    "Pause/Continue": "Pause/Continue",
    Design: "Design",
    Unassign: "Unassign",
    Closed: "Closed",
    draft: "Draft",
    success: "Success",
    failed: "failed",
    published: "Published",
  };

  const statusCategories = {
    success: ["Active", "success", "published"],
    danger: ["Pause/Continue", "failed"],
    warning: ["Design"],
    info: ["Unassign"],
    primary: ["draft"],
    secondary: ["Closed"],
  };

  let cssClass = "";
  for (const [category, statuses] of Object.entries(statusCategories)) {
    if (statuses.includes(cell)) {
      cssClass = statusMapping[category];
      break;
    }
  }
  const statusText = statusArr[cell] || "";

  return <span className={`status ${cssClass}`}>{statusText}</span>;
};
