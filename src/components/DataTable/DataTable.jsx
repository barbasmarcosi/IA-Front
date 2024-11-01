import React, { useEffect, useState } from "react";
import { Button, Card, Spin, Table } from "antd";
import { userApi } from "../../api";

const DataTable = ({ columns, data, fileUrl }) => {
  const [spin, setSpin] = useState(false);

  const fetchTable = async () => {
    try {
      const response = await userApi.get("download_table/", {
        responseType: "blob",
        params: { file_url: fileUrl },
      });

      if (response instanceof Blob || response.data instanceof Blob) {
        const tableBlob = response.data || response;
        const downloadURL = URL.createObjectURL(tableBlob);
        const link = document.createElement("a");
        link.href = downloadURL;
        link.download = "resultados.csv";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(downloadURL);
      } else {
        setError("La respuesta no es un Blob.");
      }
    } catch (err) {
      console.error("Error al descargar la tabla:", err);
      message.error("No se pudo descargar la tabla");
    }
  };

  useEffect(() => {
    setSpin(true);
    setTimeout(() => {
      setSpin(false);
    }, [1]);
  }, [data]);
  console.log(columns, data);
  const formattedColumns = [
    { title: "Label", dataIndex: "Label", key: "Label" },
    ...columns.map((columm) => ({
      title: columm,
      dataIndex: columm,
      key: columm,
    })),
  ];

  console.log(formattedColumns);

  return spin ? (
    <Spin />
  ) : (
    <Card
      title={""}
      style={{ display: "flex", flexDirection: "row", width: "100%" }}
    >
      <Table
        columns={formattedColumns}
        dataSource={data}
        loading={spin}
        style={{ width: "94vw" }}
      />
      <Button onClick={() => fetchTable()} type="primary">
        Descargar tabla
      </Button>
    </Card>
  );
};

export default DataTable;
