import React from "react";
import { Card, Collapse, Descriptions, List } from "antd";

const { Panel } = Collapse;

// const data = {
//   ZeroOrder: [{ HBSS: "2^4", PluralBinCount: 49, CardinalityDispersion: 50 }],
//   FirstOrder: [
//     { HBSS: "2^0", Distance: 1, TotalClusters: 6 },
//     { HBSS: "2^1", Distance: 1, TotalClusters: 6 },
//   ],
//   SecondOrder: {
//     SuccessConfiguration: { BinSize: 6, Distance: 1, TotalClusters: 3 },
//   },
//   Summary: {
//     ClusterizedHyperBins: 13,
//     UnclusterizedHyperBinsBeforePostclustering: 0,
//     TotalClusters: 13,
//     CardinalityDispersion: 3,
//   },
// };



const renderOrderData = (orderData) =>
  orderData.map((item, index) => (
    <Descriptions bordered column={2} key={index}>
      {Object.entries(item).map(([key, value]) => (
        <Descriptions.Item label={key} key={key}>
          {value}
        </Descriptions.Item>
      ))}
    </Descriptions>
  ));

const VisualizeData = ({ data }) => {
  return (
    <Card
      title="Resultados del análisis"
      style={{ width: "100%", margin: "auto", height: "100%" }}
    >
      <Collapse defaultActiveKey={["1"]} style={{ height: "50vh" }}>
        {Object.entries(data.Summary) && (
          <Panel header="Summary" key="1">
            <Descriptions bordered column={2}>
              {Object.entries(data.Summary).map(([key, value]) => (
                <Descriptions.Item label={key} key={key}>
                  {value}
                </Descriptions.Item>
              ))}
            </Descriptions>
          </Panel>
        )}
        {data.ZeroOrder && (
          <Panel header="Zero Order" key="2">
            {renderOrderData(data.ZeroOrder)}
          </Panel>
        )}
        {data.FirstOrder && (
          <Panel header="First Order" key="3">
            {renderOrderData(data.FirstOrder)}
          </Panel>
        )}
        {data.SecondOrder.SuccessConfiguration && (
          <Panel header="Second Order - Success Configuration" key="4">
            <Descriptions bordered column={2}>
              {Object.entries(data.SecondOrder.SuccessConfiguration).map(
                ([key, value]) => (
                  <Descriptions.Item label={key} key={key}>
                    {value}
                  </Descriptions.Item>
                )
              )}
            </Descriptions>
          </Panel>
        )}
      </Collapse>
    </Card>
  );
};

export default VisualizeData;
