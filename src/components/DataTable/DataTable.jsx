import React, { useEffect, useState } from "react";
import { Button, Card, Spin, Table } from "antd";
import { userApi } from "../../api";

const DataTable = ({ columns, data }) => {
  //   const [data, setData] = useState([]);
  const [spin, setSpin] = useState(false);

  const fetchTable = async () => {
    try {
      const response = await userApi.get("download_table/", {
        responseType: "blob", // Asegura que la respuesta se maneje como un blob
      });

      console.log("Response completa:", response);

      if (response instanceof Blob || response.data instanceof Blob) {
        // Manejo del blob dependiendo de donde se encuentra en la respuesta
        const tableBlob = response.data || response;

        // Crear un enlace para descargar el archivo
        const downloadURL = URL.createObjectURL(tableBlob);
        const link = document.createElement("a");
        link.href = downloadURL;

        // Asignar un nombre al archivo descargado (puedes modificar el nombre)
        link.download = "resultados.csv"; // Cambia la extensión si es necesario

        // Agregar y hacer clic en el enlace para iniciar la descarga
        document.body.appendChild(link);
        link.click();

        // Limpiar y eliminar el enlace después de la descarga
        document.body.removeChild(link);
        URL.revokeObjectURL(downloadURL);
      } else {
        setError("La respuesta no es un Blob.");
      }
    } catch (err) {
      console.error("Error al descargar la tabla:", err);
      setError("No se pudo descargar la tabla.");
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
    // {
    //   title: "Nombre",
    //   dataIndex: "Nombre",
    //   key: "nombre",
    // },
    // {
    //   title: "Edad",
    //   dataIndex: "Edad",
    //   key: "edad",
    // },
    // {
    //   title: "Ciudad",
    //   dataIndex: "Ciudad",
    //   key: "ciudad",
    // },
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
        style={{ width: "94vw" }}
      />
      <Button onClick={() => fetchTable()} type="primary">
        Descargar tabla
      </Button>
    </Card>
  );
};

export default DataTable;
