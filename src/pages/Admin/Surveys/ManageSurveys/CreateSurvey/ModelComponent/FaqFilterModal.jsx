import React, { useEffect, useRef, useState } from "react";
import { Form } from "react-bootstrap";
import { commonService } from "services/common.service";
import { SURVEYS_MANAGEMENT } from "apiEndpoints/SurveysManagement";
import { useTable } from "customHooks/useTable";
import {
  Button,
  ReactDataTable,
  ModalComponent,
} from "../../../../../../components";

const FaqFilterModal = ({
  showFaqFilter,
  handleAddFaq,
  companyID,
  userData,
  setshowFaqFilter,
  faqFormData,
}) => {
  const [faqList, setFaqList] = useState([]);
  // Initialize the checkedItems state based on unassignModalData
  const [checkedItems, setCheckedItems] = useState();

  // Initialize the checkAll state based on whether all items are initially checked
  const [checkAll, setCheckAll] = useState(false);

  const [searchValue] = useState("");
  const [tableFilters] = useState({});

  const tempFaq = useRef([]);

  function addDataAtIndex(dataArray, index, newData) {
    newData.checkboxData = true;
    const updatedArray = [...dataArray, newData]; // Create a copy of the original array
    return updatedArray; // Return the updated array
  }

  const removeDataAtIndex = (dataArray, idToRemove, row) => {
    let updatedArray = [];
    for (let oneRow of dataArray) {
      // eslint-disable-next-line eqeqeq
      if (oneRow.faqID == row.faqID) {
        oneRow.checkboxData = false;
      }
      updatedArray.push(oneRow);
    }
    return updatedArray;
  };

  function convertApiDataToSampleData(apiData) {
    return apiData.map((item, index) => ({
      id: index + 1,
      faqID: index + 1,
      filterhead: item.faqTitle,
      filterpara: item.faqDescription,
      checkboxData: false,
    }));
  }

  const fetchFaqList = async () => {
    const response = await commonService({
      apiEndPoint: SURVEYS_MANAGEMENT.faqDefaultSetting,
      queryParams: {
        companyID,
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userData?.apiToken}`,
      },
    });
    if (response?.status) {
     
      let testData = Array.isArray(response?.data?.data?.faqContent) ? response?.data?.data?.faqContent : [] ;

      let listData = convertApiDataToSampleData(testData);
      setFaqList(listData);
      setCheckedItems(
        listData?.reduce(
          (acc, item) => ({ ...acc, [item.id]: item.checkboxData === "true" }),
          {}
        )
      );
    } else {
      console.log("error");
    }
  };

  // Function to update checked items based on matches
  function updateCheckedItems(faqListData, selectedFaq, checkedItemsData) {
    // Iterate over the faqList
    for (const item of faqListData) {
      // Check each faq_title in selectedFaq for a match with filterhead
      for (const selectedItem of selectedFaq) {
        if (item.faqID === selectedItem.faqID) {
          checkedItemsData[item.id] = true; // Update the corresponding index to true
        }
      }
    }

    setCheckedItems(checkedItemsData);
    const allChecked = Object.values(checkedItems).every(Boolean);
    setCheckAll(allChecked);
  }

  function convertApiDataToSampleData2(apiData) {
    let updatedData = [];
    let index = 1;
    for (let oneRow of apiData) {
      if (oneRow.faqID) {
        let data = {
          id: index,
          faqID: oneRow.faqID,
          filterhead: oneRow.faq_title,
          filterpara: oneRow.faq_description,
          checkboxData: true,
        };
        // eslint-disable-next-line no-plusplus
        index++;
        updatedData.push(data);
      }
    }
    return updatedData;
  }

  // const handleFaqDefaultSetting = async () => {
  //   updateCheckedItems(faqList, faqFormData, checkedItems);
  //   let setTempData = convertApiDataToSampleData2(faqFormData);
  //   tempFaq.current = setTempData;
  // };

  // useEffect(() => {
  //   if (faqList.length > 0) {
  //     handleFaqDefaultSetting();
  //   }
  // }, [showFaqFilter]);

  useEffect(() => {
    if (companyID) {
      fetchFaqList();
    }
  }, [companyID]);

  // Effect to update the checkAll state when checkedItems changes
  useEffect(() => {
    if (checkedItems) {
      // If all values in checkedItems are true, the result is true.
      // If any value in checkedItems is false, the result is false.
      const allChecked = Object.values(checkedItems).every(Boolean);
      setCheckAll(allChecked);
    }
  }, [checkedItems]);

  // This hook is not usefull when we handle search,filter,pagination from api.
  const {
    currentData,
    totalRecords,
    totalPages,
    offset,
    limit,
    sortState,
    setOffset,
    setLimit,
    handleSort,
  } = useTable({
    searchValue,
    searchKeys: [],
    tableFilters,
    initialLimit: 10,
    data: faqList,
  });

  const handleLimitChange = (value) => {
    setLimit(value);
    setOffset(1);
  };

  const handleOffsetChange = (value) => {
    setOffset(value);
  };

  // Handler for individual checkboxes
  const handleCheckboxChange = (e, row) => {
    const { id, checked } = e.target;

    setCheckedItems((prevState) => ({
      ...prevState,
      [id]: checked,
    }));
    if (checked) {
      tempFaq.current = addDataAtIndex(tempFaq.current, id, row);
    } else {
      tempFaq.current = removeDataAtIndex(tempFaq.current, id, row);
    }
  };

  const handleCheckAllChange = (e) => {
    const { checked } = e.target;
    // Update all individual checkboxes
    setCheckedItems((prevState) =>
      Object.keys(prevState).reduce(
        (acc, key) => ({ ...acc, [key]: checked }),
        {}
      )
    );
    if (checked) {
      let data = [];
      for (let oneRow of faqList) {
        oneRow.checkboxData = true;
        data.push(oneRow);
      }
      tempFaq.current = data;
    } else {
      let data = [];
      for (let oneRow of faqList) {
        oneRow.checkboxData = false;
        data.push(oneRow);
      }
      tempFaq.current = data;
    }
  };

  const faqFilterClose = () => {
    tempFaq.current = [];
    setshowFaqFilter(false);
    let chekedList = faqList?.reduce(
      (acc, item) => ({ ...acc, [item.id]: false }),
      {}
    );

    setCheckedItems(chekedList);
  };

  const unassignColumns = [
    {
      title: "#",
      dataKey: "id",
      columnHeaderClassName: "no-sorting w-1 text-center",
    },
    {
      title: (
        <Form.Group className="form-group mb-0" controlId="checkAll">
          <Form.Check
            className="me-0"
            type="checkbox"
            checked={checkAll}
            onChange={handleCheckAllChange}
            label={<div className="primary-color" />}
          />
        </Form.Group>
      ),
      dataKey: "checkboxData",
      columnHeaderClassName: "w-1 text-center",
      columnOrderable: false,
      render: (data, row) => {
        return (
          <Form.Group className="form-group mb-0" controlId={row.id}>
            <Form.Check
              className="me-0 p-0"
              type="checkbox"
              id={row.id}
              checked={checkedItems[row.id]}
              onChange={(e) => handleCheckboxChange(e, row)}
              label={<div className="primary-color" />}
            />
          </Form.Group>
        );
      },
    },
    {
      title: "Title",
      dataKey: "title",
      columnHeaderClassName: "no-sorting",
      render: (data, row) => {
        return (
          <div className="faqFilter">
            <div className="faqFilter_Head">{row.filterhead}</div>
            <div className="faqFilter_Para">{row.filterpara}</div>
          </div>
        );
      },
    },
  ];

  const handleAdd = () => {
    handleAddFaq(tempFaq.current);
    faqFilterClose();
  };
  return (
    <ModalComponent
      modalHeader="Default FAQ"
      modalExtraClass="noFooter"
      extraBodyClassName="faqFilterModal pt-3"
      size="lg"
      show={showFaqFilter}
      onHandleCancel={faqFilterClose}
    >
      <ReactDataTable
        data={currentData}
        columns={unassignColumns}
        page={offset}
        totalLength={totalRecords}
        totalPages={totalPages}
        sizePerPage={limit}
        handleLimitChange={handleLimitChange}
        handleOffsetChange={handleOffsetChange}
        searchValue={searchValue}
        handleSort={handleSort}
        sortState={sortState}
      />

      <div className="form-btn d-flex gap-2 justify-content-end pt-2">
        <Button
          type="button"
          variant="secondary"
          className="ripple-effect"
          onClick={faqFilterClose}
        >
          Close
        </Button>
        <Button
          type="button"
          variant="primary"
          className="ripple-effect"
          onClick={handleAdd}
        >
          Add
        </Button>
      </div>
    </ModalComponent>
  );
};

export default FaqFilterModal;
