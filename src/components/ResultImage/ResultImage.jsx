import React, { useEffect, useState } from "react";
import { Image, Spin, Alert } from "antd";
import { userApi } from "../../api";

const ResultImage = ({ showResultImage, resultImagePath }) => {
  const [imageSrc, setImageSrc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        console.log({ image_path: resultImagePath });
        const response = await userApi.get("download_image/", {
          params: { image_path: resultImagePath },
          responseType: "blob",
        });
        console.log(response);

        // Verifica el contenido de la respuesta completa
        console.log("Response completa:", response);

        if (response instanceof Blob || response.data instanceof Blob) {
          // Manejo del blob dependiendo de donde se encuentra en la respuesta
          const imageBlob = response.data || response;
          const imageURL = URL.createObjectURL(imageBlob);
          setImageSrc(imageURL);
        } else {
          setError("La respuesta no es un Blob.");
        }

        setLoading(false);
      } catch (err) {
        console.error("Error al obtener la imagen:", err);
        setError("No se pudo cargar la imagen.");
        message.error("No se pudo cargar la imagen");
        setLoading(false);
      }
    };

    fetchImage();
  }, [resultImagePath]);

  if (loading) return <Spin size="large" />;
  if (error) return <Alert message={error} type="error" />;

  return (
    <Image
      width={"30vw"}
      height={"30vw"}
      src={imageSrc}
      alt="Descargada desde el servidor"
    />
  );
};

export default ResultImage;
