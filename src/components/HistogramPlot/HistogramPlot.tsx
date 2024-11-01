import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card } from "antd";

const HistogramPlot = ({ imageData, setImageData, style = {} }) => {
  //   const [imageData, setImageData] = useState("");

  useEffect(() => {
    // Llamada a la API para obtener la imagen en base64
    axios
      .get("/api/histogram") // Cambiar a la URL de tu API
      .then((response) => {
        setImageData(response.data.img_base64);
      })
      .catch((error) => {
        console.error("Error al obtener la imagen:", error);
      });
  }, []);

  return (
    <div>
      {imageData ? (
        <Card
          title={"Histograma de Valores de Centroides"}
          style={{ ...style }}
        >
          {/* <h2></h2> */}
          <img src={`data:image/png;base64,${imageData}`} alt="Histograma" />
        </Card>
      ) : (
        <p></p>
      )}
    </div>
  );
};

export default HistogramPlot;
