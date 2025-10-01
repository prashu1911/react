import React, { useEffect, useRef, useState } from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  PDFDownloadLink,
  Font,
  Image,
  Link,
  PDFViewer,
} from "@react-pdf/renderer";
import { pdf } from "@react-pdf/renderer";

import { useSelector } from "react-redux";

import { BASE_NAME } from "config";
import { IR_LOGO } from "config";
import PoppinsThin from "../../../../assets/admin/pdfFonts/Poppins-Thin.ttf";
import PoppinsExtraLight from "../../../../assets/admin/pdfFonts/Poppins-ExtraLight.ttf";
import PoppinsLight from "../../../../assets/admin/pdfFonts/Poppins-Light.ttf";
import PoppinsRegular from "../../../../assets/admin/pdfFonts/Poppins-Regular.ttf";
import PoppinsMedium from "../../../../assets/admin/pdfFonts/Poppins-Medium.ttf";
import PoppinsSemiBold from "../../../../assets/admin/pdfFonts/Poppins-SemiBold.ttf";
import PoppinsBold from "../../../../assets/admin/pdfFonts/Poppins-Bold.ttf";
// Register Poppins font
Font.register({
  family: "Poppins",
  fonts: [
    {
      src: PoppinsRegular,
      fontWeight: 300,
    },
    {
      src: PoppinsRegular,
      fontWeight: 400,
    },
    {
      src: PoppinsMedium,
      fontWeight: 500,
    },
    {
      src: PoppinsSemiBold,
      fontWeight: 600,
    },
    {
      src: PoppinsBold,
      fontWeight: 700,
    },
  ],
});
Font.registerHyphenationCallback((word) => [word]);
// Styles
const styles = StyleSheet.create({
  page: {
    padding: 20,
    flexDirection: "column",
    backgroundColor: "#ffffff",
    fontFamily: "Poppins",
    minHeight: 842,
    height: "auto",
  },
  section: {
    marginBottom: 20,
    padding: 10,
    border: "1pt solid #dee2e6",
  },
  header: {
    fontSize: 8,
    marginBottom: 3,
    fontWeight: 500,
  },
  subHeader: {
    fontSize: 14,
    marginBottom: 5,
    color: "#666",
  },
  content: {
    fontSize: 12,
    marginTop: 3,
  },
  row: {
    flexDirection: "row",
    marginBottom: 10,
  },
  col: {
    flex: 1,
    padding: 10,
  },
  borderStart: {
    borderLeftWidth: 1,
    borderLeftColor: "#dee2e6",
    paddingLeft: 20,
  },
  chartContainer: {
    width: "100%",
    height: 200,
    marginBottom: 10,
  },
  table: {
    display: "table",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 0.5,
    borderColor: "#dee2e6",
    borderTopWidth: 0.5,
    borderTopColor: "#dee2e6",
    // marginTop: 5,
  },
  standandTable: {
    display: "table",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 0.5,
    borderColor: "#dee2e6",
    // marginTop: 5,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 0.3,
    borderBottomColor: "#dee2e6",
  },
  tableRowBottomBorderColor: {
    borderBottomColor: "#dee2e6",
  },
  tableColumn: {
    flexDirection: "column",
    borderBottomWidth: 0.3,
    borderBottomColor: "#dee2e6",
  },
  standandTableColumn: {
    padding: 5,
    borderRightWidth: 0.3,
    borderRightColor: "#dee2e6",
  },
  t_Col_H: {
    fontWeight: 500,
  },
  tableCol: {
    flex: 1,
    padding: 5,
    // borderRightWidth: 1,
    // borderRightColor: "#dee2e6",
    fontWeight: 400,
  },
  fS_5: {
    fontSize: 5,
  },
  alignItemEnd: {
    alignItems: "flex-end",
  },
  textCenter: {
    textAlign: "center",
  },
  col_SNO: {
    width: 60,
    padding: 5,
    // borderRightWidth: 1,
    // borderRightColor: "#dee2e6",
    fontWeight: 400,
  },
  col_Data_Point: {
    width: 150,
    padding: 5,
    // borderRightWidth: 1,
    // borderRightColor: "#dee2e6",
    fontWeight: 400,
  },
  tableHeader: {
    // backgroundColor: "#f0f0f0",
    fontWeight: 400,
  },
  progressBar: {
    height: 10,
    backgroundColor: "#e0e0e0",
    marginTop: 5,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#0968AC",
  },
  reportSection: {
    marginBottom: 20,
    padding: 10,
    border: "1pt solid #dee2e6",
  },
  reportTitle: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: 500,
    textAlign: "left",
  },
  reportSubTitle: {
    fontSize: 14,
    marginBottom: 8,
    color: "#666",
    textAlign: "left",
  },
  progressBarContainer: {
    flexDirection: "row",
    width: "100%",
    height: 8,
    // backgroundColor: "#e0e0e0",
    // marginTop: 5,
    alignItems: "center",
    borderRadius: 2,
    fontSize: 5,
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#0968AC",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    // borderRadius: 4,
  },
  progressBarLabel: {
    fontSize: 5,
    textAlign: "center",
    color: "#fff",
  },
  tableCellCenter: {
    textAlign: "center",
    padding: 5,
    borderRightWidth: 1,
    borderRightColor: "#dee2e6",
  },
  importanceContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
  },
  importanceCircle: {
    width: 5,
    height: 5,
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: "#000",
    overflow: "hidden",
  },
  importanceCircleFilled: {
    backgroundColor: "#000",
  },
  importanceCircleHalf: {
    flexDirection: "row",
  },
  importanceCircleLeftHalf: {
    width: "50%",
    height: "100%",
    backgroundColor: "#000",
  },
  importanceCircleRightHalf: {
    width: "50%",
    height: "100%",
    backgroundColor: "#fff",
  },
  importanceCircleEmpty: {
    backgroundColor: "#fff",
  },
  verticalText: {
    transform: "rotate(-70deg)",
    fontSize: 4, // roughly 0.8rem
    height: 30, // 2.2rem
    textAlign: "left",
    fontWeight: 400,
    paddingBottom: 0,
    color: "#667085",
    textTransform: "uppercase",
  },
});

const accordionIcon =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAi0lEQVR4nO2UQQqAIBRE3wHbREWLOn6doqAWKUgo5i9bzQN3jvPgfwQhhBBpGmB1pzPk2yDfWAQW4HBnA8aC7OgyPr+8FSiRuJebBbrIQzmJWPnGNQ4TfeTBHZgjd4fE3claXiJRrfyJRPVyT2q+pXvyucRv5TmJX8o9952oMvMc4Vdr+aqFEEIAcAIrqmWTWDuVlQAAAABJRU5ErkJggg==";

const OverallWithThreeUsersTable = ({ SectionData }) => {
  const widgetData = SectionData?.attributeData?.widgetData;
  const datasetProperties = widgetData?.IRdatasetProperties || widgetData?.datasetProperties;

  return (
    <View style={styles.content}>
      <View style={{ marginTop: 10, marginBottom: 10 }}>
        <Text style={{ fontSize: 6, fontWeight: 500, marginBottom: 3 }}>Dataset Properties</Text>
        <Text style={{ fontSize: 6, fontWeight: 500 }}>Name: {datasetProperties?.dataset_name}</Text>
      </View>
      <View style={styles.standandTable}>
        <View style={styles.tableRow}>
          <Text style={[styles.col_SNO, styles.tableHeader, styles.fS_5, styles.t_Col_H, styles.standandTableColumn]}>
            S.No.
          </Text>
          <Text
            style={[styles.col_Data_Point, styles.tableHeader, styles.fS_5, styles.t_Col_H, styles.standandTableColumn]}
          >
            Data Point
          </Text>
          <Text style={[styles.tableCol, styles.tableHeader, styles.fS_5, styles.t_Col_H, styles.standandTableColumn]}>
            Filter
          </Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={[styles.col_SNO, styles.fS_5, styles.standandTableColumn]}>1</Text>
          <Text style={[styles.col_Data_Point, styles.fS_5, styles.standandTableColumn]}>Department</Text>
          <Text style={[styles.tableCol, styles.fS_5]}>{datasetProperties?.departments?.join(", ") || "-"}</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={[styles.col_SNO, styles.fS_5, styles.standandTableColumn]}>2</Text>
          <Text style={[styles.col_Data_Point, styles.fS_5, styles.standandTableColumn]}>Participant</Text>
          <Text style={[styles.tableCol, styles.fS_5]}>{datasetProperties?.participants?.join(", ") || "-"}</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={[styles.col_SNO, styles.fS_5, styles.standandTableColumn]}>3</Text>
          <Text style={[styles.col_Data_Point, styles.fS_5, styles.standandTableColumn]}>Description</Text>
          <Text style={[styles.tableCol, styles.fS_5]}>{datasetProperties?.dataset_description || "-"}</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={[styles.col_SNO, styles.fS_5, styles.standandTableColumn]}>4</Text>
          <Text style={[styles.col_Data_Point, styles.fS_5, styles.standandTableColumn]}>Demographic Filter</Text>
          <Text style={[styles.tableCol, styles.fS_5]}>
            {datasetProperties?.demographic_filter?.length > 0 ? (
              datasetProperties?.demographic_filter?.map((item, index) => (
                <Text key={index}>
                  {item.questionValue}: {item?.responses?.map((res) => res.responseValue).join(", ")}
                  {index < datasetProperties?.demographic_filter.length - 1 ? "\n" : ""}
                </Text>
              ))
            ) : (
              <Text>-</Text>
            )}
          </Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={[styles.col_SNO, styles.fS_5, styles.standandTableColumn]}>5</Text>
          <Text style={[styles.col_Data_Point, styles.fS_5, styles.standandTableColumn]}>Managers</Text>
          <Text style={[styles.tableCol, styles.fS_5]}>
            {datasetProperties?.managers?.length > 0 ? (
              datasetProperties?.managers?.map((item, index) => (
                <Text key={index}>
                  {item}
                  {index < datasetProperties.managers.length - 1 ? "\n" : ""}
                </Text>
              ))
            ) : (
              <Text>-</Text>
            )}
          </Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={[styles.col_SNO, styles.fS_5, styles.standandTableColumn]}>6</Text>
          <Text style={[styles.col_Data_Point, styles.fS_5, styles.standandTableColumn]}>Manager Reportees</Text>
          <Text style={[styles.tableCol, styles.fS_5]}>{datasetProperties?.manager_reportees || "-"}</Text>
        </View>
      </View>
    </View>
  );
};

const ReferenceDataAggregateUserTable = ({ SectionData }) => {
  return (
    <View style={styles.content}>
      <Text style={styles.subHeader}>Reference Data Properties</Text>
      {SectionData?.attributeData?.widgetData?.referenceDataProperties?.map((item, index) => (
        <View key={index}>
          <Text style={styles.subHeader}>{item?.dataset_name}</Text>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCol, styles.tableHeader, styles.fS_5, styles.t_Col_H]}>S.No.</Text>
              <Text style={[styles.tableCol, styles.tableHeader, styles.fS_5, styles.t_Col_H]}>Data Point</Text>
              <Text style={[styles.tableCol, styles.tableHeader, styles.fS_5, styles.t_Col_H]}>Filter</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCol, styles.fS_5]}>1</Text>
              <Text style={[styles.tableCol, styles.fS_5]}>Department</Text>
              <Text style={[styles.tableCol, styles.fS_5]}>{item?.departments?.join(", ")}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCol, styles.fS_5]}>2</Text>
              <Text style={[styles.tableCol, styles.fS_5]}>Participant</Text>
              <Text style={[styles.tableCol, styles.fS_5]}>{item?.participants?.join(", ")}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCol, styles.fS_5]}>3</Text>
              <Text style={[styles.tableCol, styles.fS_5]}>Demographic Question</Text>
              <Text style={[styles.tableCol, styles.fS_5]}>
                {item?.demographic_filter?.map((data, key) => (
                  <Text key={key}>
                    {data.questionValue}: {data.responses.map((res) => res.responseValue).join(", ")}
                    {key < item.demographic_filter.length - 1 ? "\n" : ""}
                  </Text>
                ))}
              </Text>
            </View>
          </View>
        </View>
      ))}
    </View>
  );
};

const ResponseRateTable = ({ SectionData }) => {
  const distribution = SectionData?.attributeData?.widgetData?.distribution || [];

  return (
    <View style={styles.content}>
      <View style={[styles.table, { width: "100%" }]}>
        <View style={styles.tableRow}>
          <Text style={[styles.tableCol, styles.tableHeader, styles.fS_5, styles.t_Col_H, { flex: 3 }]}>Name</Text>
          <Text
            style={[styles.tableCol, styles.tableHeader, styles.fS_5, styles.t_Col_H, { flex: 1, textAlign: "center" }]}
          >
            Invited
          </Text>
          <Text
            style={[styles.tableCol, styles.tableHeader, styles.fS_5, styles.t_Col_H, { flex: 1, textAlign: "center" }]}
          >
            Responded
          </Text>
          <Text
            style={[styles.tableCol, styles.tableHeader, styles.fS_5, styles.t_Col_H, { flex: 3, textAlign: "center" }]}
          >
            Participation Rate
          </Text>
        </View>
        {distribution.map((item, i) => (
          <View style={styles.tableRow} key={i + 1}>
            <Text style={[styles.tableCol, styles.fS_5, { flex: 3 }]}>{item?.name}</Text>
            <Text style={[styles.tableCol, styles.fS_5, { flex: 1, textAlign: "center" }]}>{item?.invited}</Text>
            <Text style={[styles.tableCol, styles.fS_5, { flex: 1, textAlign: "center" }]}>{item?.completed}</Text>
            <View style={[styles.tableCol, { flex: 3 }]}>
              <View style={styles.progressBarContainer}>
                {item?.participationRate > 0 && (
                  <View
                    style={[
                      styles.progressBarFill,
                      { width: `${item?.participationRate}%`, backgroundColor: "#198754" },
                    ]}
                  >
                    <Text style={styles.progressBarLabel}>{item?.participationRate}%</Text>
                  </View>
                )}
                {item?.participationRate < 100 && (
                  <View
                    style={[
                      styles.progressBarFill,
                      { width: `${100 - item?.participationRate}%`, backgroundColor: "#eee" },
                    ]}
                  >
                    <Text style={styles.progressBarLabel}>
                      {(100 - item?.participationRate).toFixed(
                        SectionData?.attributeData?.widgetData?.selectedDecimalPoint
                      )}
                      %
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

const FavorabilityIndexTable = ({ SectionData, byIntention = false }) => {
  const favorabilityData = SectionData?.attributeData?.widgetData?.favorabilityData || [];
  const displayResponseCount = SectionData?.attributeData?.widgetData?.displayResponseCount;
  const displayOverallFavorability = SectionData?.attributeData?.widgetData?.displayOverallFavorability;
  const displayBenchmark = SectionData?.attributeData?.widgetData?.displayBenchmark;
  const themeData = SectionData?.attributeData?.widgetData?.themeData;
  const displayPercentage = SectionData?.attributeData?.widgetData?.displayPercentage;
  const displayFavorableResponseCount = SectionData?.attributeData?.widgetData?.displayFavorableResponseCount;

  return (
    <View style={styles.content}>
      <View style={styles.table}>
        {/* Header Row */}
        <View style={[styles.tableRow, styles.alignItemEnd]}>
          <Text
            style={[
              styles.tableCol,
              styles.tableHeader,
              styles.fS_5,
              styles.t_Col_H,
              { flex: 2, display: "flex", alignItems: "center" },
            ]}
          >
            Name
          </Text>
          {displayResponseCount && (
            <Text
              style={[styles.tableCol, styles.tableHeader, styles.fS_5, styles.textCenter, styles.t_Col_H, { flex: 1 }]}
            >
              Responses
            </Text>
          )}
          <Text
            style={[styles.tableCol, styles.tableHeader, styles.fS_5, styles.t_Col_H, styles.textCenter, { flex: 2 }]}
          >
            Distribution
          </Text>
          {displayOverallFavorability && (
            <Text
              style={[styles.tableCol, styles.tableHeader, styles.fS_5, styles.t_Col_H, styles.textCenter, { flex: 1 }]}
            >
              Overall Favorable
            </Text>
          )}
          {displayFavorableResponseCount &&
              <Text
              style={[styles.tableCol, styles.tableHeader, styles.fS_5, styles.t_Col_H, styles.textCenter, { flex: 1 }]}
            >Favorable Count</Text>
            }
          {!byIntention &&
            displayBenchmark &&
            favorabilityData[0]?.benchmarks?.slice(0, 3).map((item, index) => (
              <Text
                key={index}
                style={[
                  styles.tableCol,
                  styles.tableHeader,
                  styles.fS_5,
                  styles.t_Col_H,
                  styles.textCenter,
                  { flex: 1 },
                ]}
              >
                {item?.name}
              </Text>
            ))}
          {byIntention &&
            displayBenchmark &&
            favorabilityData?.benchmarks?.slice(0, 3).map((item, index) => (
              <Text
                key={index}
                style={[
                  styles.tableCol,
                  styles.tableHeader,
                  styles.fS_5,
                  styles.t_Col_H,
                  styles.textCenter,
                  { flex: 1 },
                ]}
              >
                {item?.name}
              </Text>
            ))}
        </View>

        {/* Data Rows */}
        <View>
          {!byIntention ? (
            favorabilityData?.map((item, index) => (
              <View key={index}>
                {item?.selected && (
                  <View style={styles.tableRow}>
                    <View style={[styles.tableCol, styles.fS_5, { flex: 2, fontWeight: 500 }]}>
                      <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                        <Image src={accordionIcon} style={{ width: 5, height: 5, marginRight: 4 }} />
                        <Text style={{ maxWidth: "20rem", wordWrap: "break-word" }}>{item?.outcome_name}</Text>
                      </View>
                    </View>
                    {displayResponseCount && (
                      <Text style={[styles.tableCol, styles.fS_5, { flex: 1, textAlign: "center" }]}>
                        {item?.totalResponse}
                      </Text>
                    )}
                    <View style={[styles.tableCol, { flex: 2 }]}>
                      <View style={[styles.progressBarContainer, { backgroundColor: "#DEFADD" }]}>
                        {item?.favorData?.map((favor, idx) => (
                          <View
                            key={idx}
                            style={[
                              styles.progressBarFill,
                              {
                                width: `${favor?.favorPercentage === 0 ? 5 : favor?.favorPercentage}%`,
                                backgroundColor: themeData.find((theme) => theme.name === favor?.favorName)?.color,
                                borderTopLeftRadius: idx === 0 ? 2 : 0,
                                borderBottomLeftRadius: idx === 0 ? 2 : 0,
                                borderTopRightRadius: idx === item?.favorData?.length - 1 ? 2 : 0,
                                borderBottomRightRadius: idx === item?.favorData?.length - 1 ? 2 : 0,
                              },
                            ]}
                          >
                            {displayPercentage && <Text style={styles.progressBarLabel}>{favor?.favorPercentage}</Text>}
                          </View>
                        ))}
                      </View>
                    </View>
                    {displayOverallFavorability && (
                      <Text style={[styles.tableCol, styles.fS_5, { flex: 1, textAlign: "center" }]}>
                        {item?.favorableResponsePercentage}
                      </Text>
                    )}
                    {displayFavorableResponseCount &&
                      <Text style={[styles.tableCol, styles.fS_5, { flex: 1, textAlign: "center" }]}>
                        {item?.favorableResponse}
                        </Text>
                    }
                    {displayBenchmark &&
                      item?.benchmarks?.slice(0, 3).map((benchmark, idx) => (
                        <Text key={idx} style={[styles.tableCol, styles.fS_5, { flex: 1, textAlign: "center" }]}>
                          {benchmark?.value}
                        </Text>
                      ))}
                  </View>
                )}
                {item?.intentions?.map((intention, idx) => (
                  <View key={idx}>
                    {intention?.selected && (
                      <View style={styles.tableRow}>
                        <View style={[styles.tableCol, styles.fS_5, { flex: 2, fontWeight: 500 }]}>
                          <View style={{ display: "flex", flexDirection: "row", alignItems: "center", marginLeft: 10 }}>
                            <Image src={accordionIcon} style={{ width: 5, height: 5, marginRight: 4 }} />
                            <Text style={{ maxWidth: "10rem", wordWrap: "break-word" }}>
                              {intention?.intention_name}
                            </Text>{" "}
                          </View>
                        </View>

                        {displayResponseCount && (
                          <Text style={[styles.tableCol, styles.fS_5, { flex: 1, textAlign: "center" }]}>
                            {intention?.totalResponse}
                          </Text>
                        )}
                        <View style={[styles.tableCol, { flex: 2 }]}>
                          <View style={[styles.progressBarContainer, { backgroundColor: "#DEFADD" }]}>
                            {intention?.favorData?.map((favor, idx) => (
                              <View
                                key={idx}
                                style={[
                                  styles.progressBarFill,
                                  {
                                    width: `${favor?.favorPercentage === 0 ? 5 : favor?.favorPercentage}%`,
                                    backgroundColor: themeData.find((theme) => theme.name === favor?.favorName)?.color,
                                    borderTopLeftRadius: idx === 0 ? 2 : 0,
                                    borderBottomLeftRadius: idx === 0 ? 2 : 0,
                                    borderTopRightRadius: idx === intention?.favorData?.length - 1 ? 2 : 0,
                                    borderBottomRightRadius: idx === intention?.favorData?.length - 1 ? 2 : 0,
                                  },
                                ]}
                              >
                                {displayPercentage && (
                                  <Text style={styles.progressBarLabel}>{favor?.favorPercentage}</Text>
                                )}
                              </View>
                            ))}
                          </View>
                        </View>
                        {displayOverallFavorability && (
                          <Text style={[styles.tableCol, styles.fS_5, { flex: 1, textAlign: "center" }]}>
                            {intention?.favorableResponsePercentage}
                          </Text>
                        )}
                        {displayFavorableResponseCount &&
                      <Text style={[styles.tableCol, styles.fS_5, { flex: 1, textAlign: "center" }]}>
                        {intention?.favorableResponse}</Text>
                    }
                        {displayBenchmark &&
                          intention?.benchmarks?.slice(0, 3).map((benchmark, idx) => (
                            <Text key={idx} style={[styles.tableCol, styles.fS_5, { flex: 1, textAlign: "center" }]}>
                              {benchmark?.value}
                            </Text>
                          ))}
                      </View>
                    )}

                    {intention?.questions?.map((question, idx) => (
                      <View key={idx}>
                        {question?.selected && (
                          <View style={styles.tableRow}>
                            <View style={[styles.tableCol, styles.fS_5, { flex: 2 }]}>
                              <Text style={{ maxWidth: "20rem", wordWrap: "break-word", marginLeft: 25 }}>
                                {question?.question}
                              </Text>
                            </View>

                            {displayResponseCount && (
                              <Text style={[styles.tableCol, styles.fS_5, { flex: 1, textAlign: "center" }]}>
                                {question?.totalResponse}
                              </Text>
                            )}
                            <View style={[styles.tableCol, { flex: 2 }]}>
                              <View style={[styles.progressBarContainer, { backgroundColor: "#DEFADD" }]}>
                                {question?.favorData?.map((favor, idx) => (
                                  <View
                                    key={idx}
                                    style={[
                                      styles.progressBarFill,
                                      {
                                        width: `${favor?.favorPercentage === 0 ? 5 : favor?.favorPercentage}%`,
                                        backgroundColor: themeData.find((theme) => theme.name === favor?.favorName)
                                          ?.color,
                                        borderTopLeftRadius: idx === 0 ? 2 : 0,
                                        borderBottomLeftRadius: idx === 0 ? 2 : 0,
                                        borderTopRightRadius: idx === question?.favorData?.length - 1 ? 2 : 0,
                                        borderBottomRightRadius: idx === question?.favorData?.length - 1 ? 2 : 0,
                                      },
                                    ]}
                                  >
                                    {displayPercentage && (
                                      <Text style={styles.progressBarLabel}>{favor?.favorPercentage}</Text>
                                    )}
                                  </View>
                                ))}
                              </View>
                            </View>
                            {displayOverallFavorability && (
                              <Text style={[styles.tableCol, styles.fS_5, { flex: 1, textAlign: "center" }]}>
                                {question?.favorableResponsePercentage}
                              </Text>
                            )}
                            {displayFavorableResponseCount &&
                      <Text style={[styles.tableCol, styles.fS_5, { flex: 1, textAlign: "center" }]}>
                        {question?.favorableResponse}</Text>
                    }
                            {displayBenchmark &&
                              question?.benchmarks?.slice(0, 3).map((benchmark, idx) => (
                                <Text
                                  key={idx}
                                  style={[styles.tableCol, , styles.fS_5, { flex: 1, textAlign: "center" }]}
                                >
                                  {benchmark?.value}
                                </Text>
                              ))}
                          </View>
                        )}
                      </View>
                    ))}
                  </View>
                ))}
              </View>
            ))
          ) : (
            <>
              <View style={styles.tableRow}>
                <Text style={[styles.tableCol, styles.fS_5, { flex: 2, fontWeight: 500 }]}>
                  {favorabilityData?.intention_name}
                </Text>
                {displayResponseCount && (
                  <Text style={[styles.tableCol, styles.fS_5, { flex: 1, textAlign: "center" }]}>
                    {favorabilityData?.totalResponse}
                  </Text>
                )}
                <View style={[styles.tableCol, { flex: 2 }]}>
                  <View style={[styles.progressBarContainer, { backgroundColor: "#DEFADD" }]}>
                    {favorabilityData?.favorData?.map((favor, idx) => (
                      <View
                        key={idx}
                        style={[
                          styles.progressBarFill,
                          {
                            width: `${favor?.favorPercentage === 0 ? 5 : favor?.favorPercentage}%`,
                            backgroundColor: themeData.find((theme) => theme.name === favor?.favorName)?.color,
                            borderTopLeftRadius: idx === 0 ? 2 : 0,
                            borderBottomLeftRadius: idx === 0 ? 2 : 0,
                            borderTopRightRadius: idx === favorabilityData?.favorData?.length - 1 ? 2 : 0,
                            borderBottomRightRadius: idx === favorabilityData?.favorData?.length - 1 ? 2 : 0,
                          },
                        ]}
                      >
                        {displayPercentage && <Text style={styles.progressBarLabel}>{favor?.favorPercentage}</Text>}
                      </View>
                    ))}
                  </View>
                </View>
                {displayOverallFavorability && (
                  <Text style={[styles.tableCol, styles.fS_5, { flex: 1, textAlign: "center" }]}>
                    {favorabilityData?.favorableResponsePercentage}
                  </Text>
                )}
                {displayFavorableResponseCount &&
                      <Text style={[styles.tableCol, styles.fS_5, { flex: 1, textAlign: "center" }]}>
                        {favorabilityData?.favorableResponse}</Text>
                    }
                {displayBenchmark &&
                  favorabilityData?.benchmarks?.slice(0, 3).map((benchmark, idx) => (
                    <Text key={idx} style={[styles.tableCol, styles.fS_5, { flex: 1, textAlign: "center" }]}>
                      {benchmark?.value}
                    </Text>
                  ))}
              </View>

              {favorabilityData?.questions?.map((question, idx) => (
                <View key={idx}>
                  <View style={styles.tableRow}>
                    <View style={[styles.tableCol, styles.fS_5, { flex: 2 }]}>
                      <Text style={{ maxWidth: "20rem", wordWrap: "break-word", marginLeft: 15 }}>
                        {question?.question}
                      </Text>
                    </View>

                    {displayResponseCount && (
                      <Text style={[styles.tableCol, styles.fS_5, { flex: 1, textAlign: "center" }]}>
                        {question?.totalResponse}
                      </Text>
                    )}
                    <View style={[styles.tableCol, { flex: 2 }]}>
                      <View style={[styles.progressBarContainer, { backgroundColor: "#DEFADD" }]}>
                        {question?.favorData?.map((favor, idx) => (
                          <View
                            key={idx}
                            style={[
                              styles.progressBarFill,
                              {
                                width: `${favor?.favorPercentage === 0 ? 5 : favor?.favorPercentage}%`,
                                backgroundColor: themeData.find((theme) => theme.name === favor?.favorName)?.color,
                                borderTopLeftRadius: idx === 0 ? 2 : 0,
                                borderBottomLeftRadius: idx === 0 ? 2 : 0,
                                borderTopRightRadius: idx === question?.favorData?.length - 1 ? 2 : 0,
                                borderBottomRightRadius: idx === question?.favorData?.length - 1 ? 2 : 0,
                              },
                            ]}
                          >
                            {displayPercentage && <Text style={styles.progressBarLabel}>{favor?.favorPercentage}</Text>}
                          </View>
                        ))}
                      </View>
                    </View>
                    {displayOverallFavorability && (
                      <Text style={[styles.tableCol, styles.fS_5, { flex: 1, textAlign: "center" }]}>
                        {question?.favorableResponsePercentage}
                      </Text>
                    )}
                    {/* {displayBenchmark && (
                      <Text style={[styles.tableCol, styles.fS_5, { flex: 1, textAlign: "center" }]}>
                        {question?.value}
                      </Text>
                    )} */}
                    {displayFavorableResponseCount &&
                      <Text style={[styles.tableCol, styles.fS_5, { flex: 1, textAlign: "center" }]}>
                        {question?.favorableResponse}</Text>
                    }
                    {displayBenchmark &&
                      question?.benchmarks?.slice(0, 3).map((benchmark, idx) => (
                        <Text key={idx} style={[styles.tableCol, styles.fS_5, { flex: 1, textAlign: "center" }]}>
                          {benchmark?.value}
                        </Text>
                      ))}
                  </View>
                </View>
              ))}
            </>
          )}
        </View>
      </View>
    </View>
  );
};

const LogoReportTitle = ({ SectionId, sectionData, chartData }) => {
  // console.log(sectionData?.attributeData?.widgetData, "sectionData?.attributeData?.widgetData");
  return (
    <View style={styles.content}>
      <View style={styles.row}>
        <View style={[styles.col, { flex: 8, flexDirection: 'row' }]}>
          <Image
            style={{
              maxHeight: "50px" /* ✅ Max height */,
              maxWidth: "120px" /* ✅ Optional max width */,
              objectFit:'contain'
            }}
            src={`${IR_LOGO}/${sectionData?.attributeData?.widgetData?.logoPath}`} />
          <View style={{ flexDirection: 'column', width:'100%', alignItems:'center' }}>

            <Text style={styles.header}>{sectionData?.attributeData?.widgetData?.title || "Untitled Section"}</Text>
            {sectionData?.attributeData?.widgetData?.subTitle && (
              <Text style={{ fontSize: 6, fontWeight: 400, marginBottom: 4 }}>
                {sectionData?.attributeData?.widgetData?.subTitle}
              </Text>
            )}
          </View>
        </View>
      </View>
    </View>
    // <div
    //   id={`logo-container-${SectionId}`}
    //   className="convertThisSection d-flex align-items-center justify-content-between gap-3"
    // >
    //   <img
    //     src={`${IR_LOGO}/${sectionData?.attributeData?.widgetData?.logoPath}`}
    //     className="reportLogo"
    //     style={{
    //       height: "auto",
    //       maxHeight: "80px" /* ✅ Max height */,
    //       maxWidth: "250px" /* ✅ Optional max width */,
    //       object: "contain" /* ✅ Maintain aspect ratio inside limits */,
    //     }}
    //   />
    //   <div style={{ width: "100%" }}>
    //     <h3 className="reportTitle mb-0" style={{ textAlign: "center", width: "100%", }}>
    //       {sectionData?.attributeData?.widgetData?.title}
    //     </h3>
    //   </div>
    // </div>
  );
};

const SupportingDocuments = ({ SectionId, sectionData }) => (
  <View style={styles.content}>
    {sectionData?.attributeData?.widgetData?.files?.length > 0 ? (
      <View style={styles.table}>
        <View style={styles.tableRow}>
          <Text style={[styles.tableCol, styles.tableHeader, styles.fS_5, { flex: 1, textAlign: "center" }]}>
            S.No.
          </Text>
          <Text style={[styles.tableCol, styles.tableHeader, styles.fS_5, { flex: 3 }]}>File Name</Text>
        </View>
        {sectionData?.attributeData?.widgetData?.files?.map((item, index) => (
          <View key={index} style={styles.tableRow}>
            <Text style={[styles.tableCol, styles.fS_5, { flex: 1, textAlign: "center" }]}>{index + 1}</Text>
            <Link
              style={[styles.tableCol, styles.fS_5, { flex: 3 }]}
              src={`${BASE_NAME}/storage/uploads/documents/IRSupportDocs/${item?.file_name}`}
            >
              {item.name}
            </Link>
          </View>
        ))}
      </View>
    ) : null}
  </View>
);

const ResponseRateDistribution = ({ SectionId, sectionData, chartData }) => {
  return (
    <View style={styles.content}>
      <View>{chartData ? <Image src={chartData} style={{ width: "100%", height: "auto" }} /> : null}</View>

      {sectionData?.attributeData?.widgetData?.responseRateDistribution &&
        sectionData?.attributeData?.widgetData?.distribution?.length > 0 && (
          <View style={styles.reportSection}>
            <Text style={styles.reportTitle}>Response Rate</Text>
            {/* <Text style={styles.subHeader}>Breakout: {sectionData?.attributeData?.widgetData?.breakout}</Text> */}
            <ResponseRateTable SectionData={sectionData} />
          </View>
        )}

      {sectionData?.attributeData?.widgetData?.IRdatasetPropertiesFlag &&
        sectionData?.attributeData?.widgetData?.IRdatasetProperties && (
          <View>
            <OverallWithThreeUsersTable SectionData={sectionData} />
          </View>
        )}

      {sectionData?.attributeData?.widgetData?.referenceDataPropertiesFlag &&
        sectionData?.attributeData?.widgetData?.referenceDataProperties?.length > 0 && (
          <View>
            <ReferenceDataAggregateUserTable SectionData={sectionData} />
          </View>
        )}
    </View>
  );
};

const ReportDatasetProperties = ({ SectionId, sectionData }) => (
  <View style={styles.content}>
    <OverallWithThreeUsersTable SectionData={sectionData} />
  </View>
);

const InformationGraphic = ({ SectionId, sectionData, chartData }) => (
  <View style={styles.content}>
    {chartData ? <Image src={chartData} style={{ width: "100%", height: "auto" }} /> : null}
  </View>
);

const TornadoChartSection = ({ SectionId, sectionData, chartData }) => (
  <View style={styles.content}>
    {chartData ? <Image src={chartData} style={{ width: "100%", height: "auto" }} /> : null}
    {sectionData?.attributeData?.widgetData?.IRdatasetPropertiesFlag &&
      sectionData?.attributeData?.widgetData?.IRdatasetProperties && (
        <OverallWithThreeUsersTable SectionData={sectionData} />
      )}
    {sectionData?.attributeData?.widgetData?.referenceDataPropertiesFlag &&
      sectionData?.attributeData?.widgetData?.referenceDataProperties?.length > 0 && (
        <ReferenceDataAggregateUserTable SectionData={sectionData} />
      )}
  </View>
);

const DepartmentResponseRate = ({ SectionId, sectionData }) => (
  <View style={styles.content}>
    {/* <Text style={styles.subHeader}>Breakout: {sectionData?.attributeData?.widgetData?.breakout}</Text> */}
    {sectionData?.attributeData?.widgetData?.responseRateDistribution && (
      <ResponseRateTable SectionData={sectionData} />
    )}
    {sectionData?.attributeData?.widgetData?.IRdatasetPropertiesFlag &&
      sectionData?.attributeData?.widgetData?.IRdatasetProperties && (
        <OverallWithThreeUsersTable SectionData={sectionData} />
      )}
    {sectionData?.attributeData?.widgetData?.referenceDataPropertiesFlag &&
      sectionData?.attributeData?.widgetData?.referenceDataProperties?.length > 0 && (
        <ReferenceDataAggregateUserTable SectionData={sectionData} />
      )}
  </View>
);

const TargetChartSection = ({ SectionId, sectionData, chartData }) => {
  return (
    <View style={styles.content}>
      {chartData ? <Image src={chartData} style={{ width: "100%", height: "auto" }} /> : null}
      {sectionData?.attributeData?.widgetData?.IRdatasetPropertiesFlag &&
        sectionData?.attributeData?.widgetData?.IRdatasetProperties && (
          <OverallWithThreeUsersTable SectionData={sectionData} />
        )}
      {sectionData?.attributeData?.widgetData?.referenceDataPropertiesFlag &&
        sectionData?.attributeData?.widgetData?.referenceDataProperties?.length > 0 && (
          <ReferenceDataAggregateUserTable SectionData={sectionData} />
        )}
    </View>
  );
};

const ErrorBarChartSection = ({ SectionId, sectionData, chartData }) => {
  let type = sectionData?.attributeData?.widgetData?.aggregateChart;
  return (
    <View style={styles.content}>
      {chartData ? <Image src={chartData} style={{ width: "100%", height: "auto" }} /> : null}
      {sectionData?.attributeData?.widgetData?.IRdatasetPropertiesFlag &&
        sectionData?.attributeData?.widgetData?.IRdatasetProperties && (
          <OverallWithThreeUsersTable SectionData={sectionData} />
        )}
      {sectionData?.attributeData?.widgetData?.referenceDataPropertiesFlag &&
        sectionData?.attributeData?.widgetData?.referenceDataProperties?.length > 0 && (
          <ReferenceDataAggregateUserTable SectionData={sectionData} />
        )}
    </View>
  );
};

const FavorabilityIndex = ({ SectionId, sectionData }) => (
  <View style={styles.content}>
    {Array.isArray(sectionData?.attributeData?.widgetData?.favorabilityData) && (
      <FavorabilityIndexTable SectionData={sectionData} />
    )}
    {sectionData?.attributeData?.widgetData?.IRdatasetPropertiesFlag &&
      sectionData?.attributeData?.widgetData?.IRdatasetProperties && (
        <OverallWithThreeUsersTable SectionData={sectionData} />
      )}
    {sectionData?.attributeData?.widgetData?.referenceDataPropertiesFlag &&
      sectionData?.attributeData?.widgetData?.referenceDataProperties?.length > 0 && (
        <ReferenceDataAggregateUserTable SectionData={sectionData} />
      )}
  </View>
);

const GeneralChartSection = ({ SectionId, sectionData, chartData }) => {
  return (
    <View style={styles.content}>
      {chartData ? <Image src={chartData} style={{ width: "100%", height: "auto" }} /> : null}
      {sectionData?.attributeData?.widgetData?.IRdatasetPropertiesFlag &&
        sectionData?.attributeData?.widgetData?.IRdatasetProperties && (
          <OverallWithThreeUsersTable SectionData={sectionData} />
        )}
      {sectionData?.attributeData?.widgetData?.referenceDataPropertiesFlag &&
        sectionData?.attributeData?.widgetData?.referenceDataProperties?.length > 0 && (
          <ReferenceDataAggregateUserTable SectionData={sectionData} />
        )}
    </View>
  );
};

const HeatMapSection = ({ SectionId, sectionData, chartData }) => {
  function processHeatmapHeader(arr) {
    const uniqueTypes = new Set();
    const demographicById = {};

    arr.forEach(item => {
      if (item.type !== "demographic") {
        uniqueTypes.add(item.type);
      } else {
        if (!(item.id in demographicById)) {
          // Only take first encountered element per unique demographic id
          const idx = item.name.indexOf("~");
          demographicById[item.id] =
            idx !== -1
              ? item.name.substring(0, idx).trim()
              : item.name.trim();
        }
      }
    });

    return {
      uniqueTypes: Array.from(uniqueTypes),
      demographicLabels: Object.values(demographicById),
    };
  }
  // Example usage:
  const result = processHeatmapHeader(sectionData?.attributeData?.widgetData?.heatmapHeader);
  
  function getQuestionsWithSelectedResponse(demographic) {

    
    // Use a Set to avoid duplicate question names
    const questions = new Set();
    
    demographic.forEach(item => {
      if (
        Array.isArray(item.responses) &&
        item.responses.some(resp => resp.selected === true)
      ) {
        questions.add(item.question);
      }
    });
    
    return Array.from(questions);
  }
  
  // Example usage:
  const questionNames = sectionData?.attributeData?.controlData?.heatmapType===1? []: getQuestionsWithSelectedResponse(sectionData?.attributeData?.controlData?.dataPointControlList2?.demographic);

  return (
    <View style={styles.content}>
      {sectionData?.attributeData?.widgetData?.instructionFlag && (
        <>
          {chartData ? <Image src={chartData} style={{ width: "100%", height: "auto" }} /> : null}
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12, marginTop: 10 }}>
            {sectionData?.attributeData?.controlData?.dataCoRelationSettings.map((item, index) => (
              <View key={index} style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                <View
                  style={{
                    backgroundColor: "#f8f9fa",
                    borderWidth: 1,
                    borderColor: "#dee2e6",
                    borderRadius: 20,
                    width: 30,
                    height: 15,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={{ fontSize: 5, color: "#212529" }}>
                    <Text>+/- </Text>
                    <Text> {item?.pointValue}</Text>
                  </Text>
                </View>
                <View
                  style={{
                    width: 15,
                    height: 15,
                    borderWidth: 1,
                    borderColor: "#dee2e6",
                    borderRadius: 4,
                    flexDirection: "row",
                  }}
                >
                  <View
                    style={{
                      width: "50%",
                      height: "100%",
                      backgroundColor: item?.positiveColor,
                    }}
                  />
                  <View
                    style={{
                      width: "50%",
                      height: "100%",
                      backgroundColor: item?.negativeColor,
                    }}
                  />
                </View>
              </View>
            ))}
          </View>
        </>
      )}

      {sectionData?.attributeData?.widgetData?.heatmapData && (
        <>
          <Text style={[styles.subHeader, { marginTop: 6, fontSize: 6, fontWeight: 500, color: "#000", }]}>
            Comparison:&nbsp;
            <Text style={{   }}>
              {sectionData?.attributeData?.widgetData?.heatmapData[0]?.datapoints[0]?.name}
            </Text>
          </Text>
          <Text style={[styles.subHeader, {color: "#000", marginTop: 6, fontSize: 6, fontWeight: 500 }]}>
          Breakout:&nbsp;
            <Text style={{   }}>
            {result.uniqueTypes.join(", ")} {questionNames.join(", ")}
            </Text>
          </Text>
          <View style={[styles.standandTable, { width: "100%", borderTop: "none" }]}>
            {/* Header Row */}
            <View style={[styles.tableRow, { height: 50, alignItems: "flex-end" }]}>
              <Text style={[styles.tableCol, styles.tableHeader, styles.fS_5, { flex: 3 }]}>Question</Text>
              {sectionData?.attributeData?.widgetData?.heatmapHeader?.map((header, index) => (
                <Text
                  key={index}
                  style={[
                    styles.tableCol,
                    styles.tableHeader,
                    styles.fS_5,
                    styles.verticalText,
                    { flex: 0.5, textAlign: "center", fontWeight: 500 },
                  ]}
                >
                  {header.name}
                </Text>
              ))}
            </View>

            {/* Data Rows */}
            <View style={[styles.tableRow, { backgroundColor: "#f8f9fa" }]}>
              <View style={[styles.standandTableColumn, styles.tableHeader, styles.fS_5, { flex: 3 }]}>
                <Text>Object</Text>
              </View>

              {sectionData?.attributeData?.widgetData?.heatmapHeader?.map((x, i) => (
                <View
                  style={[
                    styles.standandTableColumn,
                    styles.tableHeader,
                    styles.fS_5,
                    { flex: 0.5, textAlign: "center" },
                  ]}
                >
                  <Text key={i + 1} style={{ fontWeight: i === 0 ? 500 : null }}>
                    {x?.userCount}
                  </Text>
                </View>
              ))}
            </View>

            {sectionData?.attributeData?.widgetData?.heatmapData?.map((item, index) => (
              <React.Fragment key={`outcome-${index}`}>
                {/* Outcome Row */}
                {item?.selected && (
                  <View style={[styles.tableRow, { borderBottomWidth: 0 }]}>
                    <View
                      style={[
                        styles.standandTableColumn,
                        styles.fS_5,
                        styles.tableRowBottomBorderColor,
                        { flex: 3, flexDirection: "row", alignItems: "center", borderBottomWidth: 0.2 },
                      ]}
                    >
                      <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                        {item?.intentions?.length > 0 && (
                          <Image src={accordionIcon} style={{ width: 5, height: 5, marginRight: 3 }} />
                        )}
                        <Text style={{ maxWidth: "20rem", wordWrap: "break-word" }}>{item?.outcome_name}</Text>
                      </View>
                    </View>
                    {item?.datapoints?.map((datapoint, dpIndex) => (
                      <View
                        key={`outcome-dp-${dpIndex}`}
                        style={[
                          styles.standandTableColumn,
                          styles.fS_5,
                          {
                            flex: 0.5,
                            textAlign: "center",
                            backgroundColor: datapoint?.color || "#fff",
                            borderColor: datapoint?.color || "#fff",
                          },
                        ]}
                      >
                        <Text>{datapoint?.value}%</Text>
                      </View>
                    ))}
                  </View>
                )}

                {/* Intention Rows */}
                {item?.intentions?.map((intention, intentIndex) => (
                  <React.Fragment key={`intention-${index}-${intentIndex}`}>
                    {intention?.selected && (
                      <View style={[styles.tableRow, { borderBottomWidth: 0 }]}>
                        <View
                          style={[
                            styles.standandTableColumn,
                            styles.fS_5,
                            styles.tableRowBottomBorderColor,
                            { flex: 3, borderBottomWidth: 0.2 },
                          ]}
                        >
                          <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                            {intention?.questions?.length > 0 && (
                              <Image
                                src={accordionIcon}
                                style={{ width: 5, height: 5, marginLeft: 6, marginRight: 3 }}
                              />
                            )}
                            <Text style={{ maxWidth: "8rem", wordWrap: "break-word" }}>
                              {intention?.intention_name}
                            </Text>
                          </View>
                        </View>
                        {intention?.datapoints?.map((datapoint, dpIndex) => (
                          <View
                            key={`intention-dp-${index}-${intentIndex}-${dpIndex}`}
                            style={[
                              styles.standandTableColumn,
                              styles.fS_5,
                              {
                                flex: 0.5,
                                textAlign: "center",
                                backgroundColor: datapoint?.color || "#fff",
                                borderColor: datapoint?.color || "#fff",
                              },
                            ]}
                          >
                            <Text>{datapoint?.value}%</Text>
                          </View>
                        ))}
                      </View>
                    )}

                    {/* Question Rows */}
                    {intention?.questions?.map(
                      (question, qIndex) =>
                        question?.selected && (
                          <View
                            key={`question-${index}-${intentIndex}-${qIndex}`}
                            style={[styles.tableRow, { borderBottomWidth: 0 }]}
                          >
                            <View
                              style={[
                                styles.standandTableColumn,
                                styles.fS_5,
                                styles.tableRowBottomBorderColor,
                                { flex: 3, borderBottomWidth: 0.2 },
                              ]}
                            >
                              <Text style={{ maxWidth: "20rem", wordWrap: "break-word", marginLeft: 20 }}>
                                {question?.question}
                              </Text>
                            </View>
                            {question?.datapoints?.map((datapoint, dpIndex) => (
                              <View
                                key={`question-dp-${index}-${intentIndex}-${qIndex}-${dpIndex}`}
                                style={[
                                  styles.standandTableColumn,
                                  styles.fS_5,
                                  {
                                    flex: 0.5,
                                    textAlign: "center",
                                    backgroundColor: datapoint?.color || "#fff",
                                    borderColor: datapoint?.color || "#fff",
                                  },
                                ]}
                              >
                                <Text>{datapoint?.value}%</Text>
                              </View>
                            ))}
                          </View>
                        )
                    )}
                  </React.Fragment>
                ))}
              </React.Fragment>
            ))}
          </View>
        </>
      )}
      {sectionData?.attributeData?.widgetData?.IRdatasetPropertiesFlag &&
        sectionData?.attributeData?.widgetData?.IRdatasetProperties && (
          <OverallWithThreeUsersTable SectionData={sectionData} />
        )}
    </View>
  );
};

const WordCloudSection = ({ SectionId, sectionData, chartData }) => (
  <View style={styles.content}>
    {chartData ? <Image src={chartData} style={{ width: "100%", height: "auto" }} /> : null}
    {sectionData?.attributeData?.widgetData?.IRdatasetPropertiesFlag &&
      sectionData?.attributeData?.widgetData?.IRdatasetProperties && (
        <OverallWithThreeUsersTable SectionData={sectionData} />
      )}
    {sectionData?.attributeData?.widgetData?.referenceDataPropertiesFlag &&
      sectionData?.attributeData?.widgetData?.referenceDataProperties?.length > 0 && (
        <ReferenceDataAggregateUserTable SectionData={sectionData} />
      )}
  </View>
);

const OpenEndedResponse = ({ SectionId, sectionData }) => (
  <View style={styles.content}>
    {sectionData?.attributeData?.widgetData?.oeqQuestionData?.map((questionItem, i) => (
      <View key={i + 1}>
        <Text style={{ fontSize: 6, fontWeight: 500, marginBottom: 6 }}>{questionItem?.question}</Text>
        {questionItem.responses.map((response, j) => (
          <Text key={j + 1} style={{ marginBottom: 3, fontSize: 5, fontWeight: 400, color: "#696969" }}>
            {j + 1}. {response}
          </Text>
        ))}
      </View>
    ))}
  </View>
);

const FavorabilityByIntention = ({ SectionId, sectionData, chartData }) => (
  <View style={styles.content}>
    {sectionData?.attributeData?.widgetData?.favorabilityData && (
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-start",
          borderWidth: 0.5,
          borderColor: "#dee2e6",
        }}
      >
        {chartData ? (
          <View style={{ marginTop: 5, flex: 0.5 }}>
            <Image src={chartData} style={{ width: "100%", height: "auto" }} />
          </View>
        ) : null}

        <View style={{ flex: 2.5 }}>
          <FavorabilityIndexTable byIntention SectionData={sectionData} />
        </View>
      </View>
    )}
    {sectionData?.attributeData?.widgetData?.IRdatasetPropertiesFlag &&
      sectionData?.attributeData?.widgetData?.IRdatasetProperties && (
        <OverallWithThreeUsersTable SectionData={sectionData} />
      )}
    {sectionData?.attributeData?.widgetData?.referenceDataPropertiesFlag &&
      sectionData?.attributeData?.widgetData?.referenceDataProperties?.length > 0 && (
        <ReferenceDataAggregateUserTable SectionData={sectionData} />
      )}
  </View>
);

const ProximityTable = ({ SectionData }) => {
  const importanceData = SectionData?.attributeData?.widgetData?.importanceData || [];
  const showImportance = SectionData?.attributeData?.widgetData?.showImportance;
  const showImportanceValue = SectionData?.attributeData?.widgetData?.showImportanceValue;
  const displayResponseCount = SectionData?.attributeData?.widgetData?.displayResponseCount;
  const displayOverallFavorability = SectionData?.attributeData?.widgetData?.displayOverallFavorability;
  const displayFavorableResponseCount = SectionData?.attributeData?.widgetData?.displayFavorableResponseCount;
  const displayPercentage = SectionData?.attributeData?.widgetData?.displayPercentage;
  const displayBenchmark = SectionData?.attributeData?.widgetData?.displayBenchmark;
  const themeData = SectionData?.attributeData?.widgetData?.themeData;

  const renderImportanceCircles = (percentage) => {
    const circles = [];
    const thresholds = [
      { fill: 25, half: 12.5 },
      { fill: 50, half: 37.5 },
      { fill: 75, half: 62.5 },
      { fill: 99, half: 87.5 },
    ];

    for (let i = 0; i < 4; i++) {
      if (percentage > thresholds[i].fill) {
        circles.push(<View key={i} style={[styles.importanceCircle, styles.importanceCircleFilled]} />);
      } else if (percentage > thresholds[i].half) {
        circles.push(
          <View key={i} style={[styles.importanceCircle, styles.importanceCircleHalf]}>
            <View style={styles.importanceCircleLeftHalf} />
            <View style={styles.importanceCircleRightHalf} />
          </View>
        );
      } else {
        circles.push(<View key={i} style={[styles.importanceCircle, styles.importanceCircleEmpty]} />);
      }
    }

    return <View style={styles.importanceContainer}>{circles}</View>;
  };

  return (
    <View style={styles.content}>
      <View style={styles.table}>
        {/* Header Row */}
        <View style={[styles.tableRow, styles.alignItemEnd]}>
          {showImportance && (
            <Text
              style={[styles.tableCol, styles.tableHeader, styles.fS_5, styles.t_Col_H, styles.textCenter, { flex: 1 }]}
            >
              Importance
            </Text>
          )}
          {showImportanceValue && (
            <Text
              style={[styles.tableCol, styles.tableHeader, styles.fS_5, styles.t_Col_H, styles.textCenter, { flex: 1 }]}
            >
              Value
            </Text>
          )}
          <Text style={[styles.tableCol, styles.tableHeader, styles.fS_5, styles.t_Col_H, { flex: 2 }]}>Question</Text>
          {displayResponseCount && (
            <Text
              style={[styles.tableCol, styles.tableHeader, styles.fS_5, styles.t_Col_H, styles.textCenter, { flex: 1 }]}
            >
              Responses
            </Text>
          )}
          <Text
            style={[styles.tableCol, styles.tableHeader, styles.fS_5, styles.t_Col_H, styles.textCenter, { flex: 2 }]}
          >
            Distribution
          </Text>
          {displayOverallFavorability && (
            <Text
              style={[styles.tableCol, styles.tableHeader, styles.fS_5, styles.t_Col_H, styles.textCenter, { flex: 1 }]}
            >
              Overall Favorable
            </Text>
          )}
          {displayFavorableResponseCount && (
            <Text
              style={[styles.tableCol, styles.tableHeader, styles.fS_5, styles.t_Col_H, styles.textCenter, { flex: 1 }]}
            >
              Favorable Count
            </Text>
          )}
          {displayBenchmark &&
            importanceData[0]?.benchmarks?.slice(0, 3)?.map((item, index) => (
              <Text
                key={index}
                style={[
                  styles.tableCol,
                  styles.tableHeader,
                  styles.fS_5,
                  styles.t_Col_H,
                  styles.textCenter,
                  { flex: 1 },
                ]}
              >
                {item?.name}
              </Text>
            ))}
        </View>

        {/* Data Rows */}
        {importanceData.map((item, index) => (
          <View key={index} style={styles.tableRow}>
            {showImportance && (
              <View style={[styles.tableCol, { flex: 1 }]}>
                {renderImportanceCircles(item?.correlationCoefficantPercentage)}
              </View>
            )}
            {showImportanceValue && (
              <Text style={[styles.tableCol, styles.fS_5, styles.textCenter, { flex: 1 }]}>
                {item?.correlationCoefficant.toFixed(4)}
              </Text>
            )}
            <Text style={[styles.tableCol, styles.fS_5, { flex: 2 }]}>{item?.question}</Text>
            {displayResponseCount && (
              <Text style={[styles.tableCol, styles.fS_5, styles.textCenter, { flex: 1 }]}>{item?.totalResponse}</Text>
            )}
            <View style={[styles.tableCol, { flex: 2 }]}>
              <View style={styles.progressBarContainer}>
                {item?.favorData?.map((favor, idx) => (
                  <View
                    key={idx}
                    style={[
                      styles.progressBarFill,
                      {
                        width: `${favor?.favorPercentage === 0 ? 5 : favor?.favorPercentage}%`,
                        backgroundColor: themeData.find((theme) => theme.name === favor?.favorName)?.color,
                        borderTopLeftRadius: idx === 0 ? 2 : 0,
                        borderBottomLeftRadius: idx === 0 ? 2 : 0,
                        borderTopRightRadius: idx === item?.favorData?.length - 1 ? 2 : 0,
                        borderBottomRightRadius: idx === item?.favorData?.length - 1 ? 2 : 0,
                      },
                    ]}
                  >
                    <Text style={styles.progressBarLabel}>{favor?.favorPercentage}</Text>
                  </View>
                ))}
              </View>
            </View>
            {displayOverallFavorability && (
              <Text style={[styles.tableCol, styles.fS_5, styles.textCenter, { flex: 1 }]}>
                {item?.favorableResponsePercentage?.toFixed(SectionData?.attributeData?.widgetData?.selectedDecimalPoint || 0)}
              </Text>
            )}
            {displayFavorableResponseCount && (
              <Text style={[styles.tableCol, styles.fS_5, styles.textCenter, { flex: 1 }]}>
                {item?.favorableResponse}
              </Text>
            )}
            {displayBenchmark &&
              item?.benchmarks?.slice(0, 3).map((benchmark, idx) => (
                <Text key={idx} style={[styles.tableCol, styles.fS_5, styles.textCenter, { flex: 1 }]}>
                  {benchmark?.value}
                </Text>
              ))}
          </View>
        ))}
      </View>
    </View>
  );
};

const Proximity = ({ SectionId, sectionData }) => {
  const hasNaN = sectionData?.attributeData?.widgetData?.importanceData.some(
    item => Number.isNaN(item.correlationCoefficant)
);
  return(
  <View style={styles.content}>
    {sectionData?.attributeData?.widgetData?.importanceData && <ProximityTable SectionData={sectionData} />}
    {hasNaN &&
                    <Text style={{ fontSize: 5, color:'red' }} > *NaN - Correlation calculation failed due to lack of variability in the data</Text>
                }
    {sectionData?.attributeData?.widgetData?.IRdatasetPropertiesFlag &&
      sectionData?.attributeData?.widgetData?.IRdatasetProperties && (
        <OverallWithThreeUsersTable SectionData={sectionData} />
      )}
    {sectionData?.attributeData?.widgetData?.referenceDataPropertiesFlag &&
      sectionData?.attributeData?.widgetData?.referenceDataProperties?.length > 0 && (
        <ReferenceDataAggregateUserTable SectionData={sectionData} />
      )}
  </View>
)};

const PageBreak = ({ SectionId, sectionData }) => (
  <View style={styles.content}>
    <Text style={{ textAlign: "center" }}>--- Page Break ---</Text>
  </View>
);

// Widget Components Mapping
const widgetComponents = {
  standard_logo_title: LogoReportTitle,
  standard_support_documents: SupportingDocuments,
  standard_response_overall: ResponseRateDistribution,
  std_dataset_property: ReportDatasetProperties,
  std_instruction_comment: InformationGraphic,
  std_error_tornado_chart: TornadoChartSection,
  standard_response_department: DepartmentResponseRate,
  std_error_target_chart: TargetChartSection,
  std_error_bar_chart: ErrorBarChartSection, //Not Working
  std_page_break: PageBreak,
  std_favorability: FavorabilityIndex,
  std_snapshot_chart: GeneralChartSection,
  std_heatmap: HeatMapSection,
  std_word_cloud: WordCloudSection,
  std_response_openend: OpenEndedResponse,
  std_favorability_by_intention: FavorabilityByIntention,
  std_proximity: Proximity,
};

// Combined PDF Component
const CombinedPDF = ({ ReportWidgetList = [], SectionData = {}, chartImages = [] }) => {
  // Group widgets by pages based on page breaks
  const groupWidgetsByPages = (widgets) => {
    const pages = [];
    let currentPage = [];

    widgets.forEach((widget, index) => {
      if (widget.widgetTag === "std_page_break") {
        if (currentPage.length > 0) {
          pages.push(currentPage);
          currentPage = [];
        }
      } else {
        currentPage.push(widget);
      }
    });

    if (currentPage.length > 0) {
      pages.push(currentPage);
    }

    return pages;
  };

  const pages = groupWidgetsByPages(ReportWidgetList);

  return (
    <Document>
      {pages?.map((pageWidgets, pageIndex) => (
        <Page key={`page-${pageIndex}`} size="A4" style={styles.page} wrap={false}>
          {pageWidgets?.map((widget, i) => {
            const sectionData = SectionData[widget.sectionID];
            const ComponentType = widgetComponents[widget.widgetTag];
            const chartData = chartImages?.find((chart) => chart.sectionId === widget.sectionID)?.imgData;
            return (
              <View style={styles.section} key={i + 1} break={false}>
                {ComponentType && (
                  <ComponentType SectionId={widget.sectionID} sectionData={sectionData} chartData={chartData} />
                )}
              </View>
            );
          })}
        </Page>
      ))}
    </Document>
  );
};



const PdfGenerator = ({ ReportWidgetList, SectionData, generatedImages, downloadExistPdf, revertBack }) => {
  console.log("downloadExistPdf", downloadExistPdf);
  const [pdfUrl, setPdfUrl] = useState(null);

  useEffect(() => {
    const generatePdf = async () => {
      try {
        const blob = await pdf(
          <CombinedPDF ReportWidgetList={ReportWidgetList} SectionData={SectionData} chartImages={generatedImages} />
        ).toBlob();
        const url = URL.createObjectURL(blob);
        setPdfUrl(url);

        // Create a temporary link and trigger download
        const link = document.createElement("a");
        link.href = url;
        link.download = "report.pdf";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Open PDF in new tab
        window.open(url, "_blank");
        revertBack(false);
        // Cleanup after a delay to ensure the PDF is opened
        setTimeout(() => {
          URL.revokeObjectURL(url);
        }, 1000);
      } catch (error) {
        console.error("Error generating PDF:", error);
      }
    };
    if ((generatedImages?.length > 0 && downloadExistPdf === null) || downloadExistPdf) {
      generatePdf();
    }
  }, [ReportWidgetList, SectionData, generatedImages, downloadExistPdf]);

  return null;
  // return (
  //   <>
  //     {SectionData && ReportWidgetList?.length > 0 && generatedImages?.length > 0 ? (
  //       <div style={{ height: "90vh", border: "1px solid #dee2e6" }}>
  //         <PDFViewer width="100%" height="100%">
  //           <CombinedPDF ReportWidgetList={ReportWidgetList} SectionData={SectionData} chartImages={generatedImages} />
  //         </PDFViewer>
  //       </div>
  //     ) : null}
  //   </>
  // );
};

export default PdfGenerator;
