const OutcomeTableData = ({ outcomeChart }) => {
  // Extract unique outcome names (assumes all participants have same outcome structure)
  const outcomeHeaders =
    outcomeChart[0]?.outcomes.map((o) => o.outcome_name) || [];

  return (
    <table className="mt-xxl-3 mt-2">
      <thead>
        <tr>
        <th>Outcomes / Participant</th>
        {outcomeHeaders.map((header, index) => (
            <th key={index}>{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {outcomeChart.map((item) => (
          <tr key={item.info_id}>
                            <td>{item?.info_name?.replace('Department Overall',"Overall")}</td>
                            {item.outcomes.map((outcome) => (
              <td key={outcome.outcome_id}>{outcome.value}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default OutcomeTableData;
