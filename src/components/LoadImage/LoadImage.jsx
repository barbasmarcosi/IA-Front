import React, { useState } from "react";
import { Upload, message, Image } from "antd";
import ImgCrop from "antd-img-crop";
import { PlusOutlined } from "@ant-design/icons";
import { saveAs } from "file-saver";
import Compressor from "compressorjs";

const LoadImage = ({ image, setImage }) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState([]);

  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };

  const handleChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
    setImage(newFileList.length ? newFileList[0] : null);
  };

  const validateAndConvertImage = (file) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      message.error("El archivo seleccionado no es una imagen.");
      return Upload.LIST_IGNORE;
    }

    // Convertir a PNG si no es PNG
    if (file.type !== "image/png") {
      message.error("La imagen debe ser formato PNG");
      //   new Compressor(file, {
      //     convertSize: 1024, // 1KB para convertir a PNG
      //     convertTypes: ["image/png"],
      //     success: (compressedFile) => {
      //       const convertedFile = new File(
      //         [compressedFile],
      //         `${file.name.split(".")[0]}.png`,
      //         {
      //           type: "image/png",
      //         }
      //       );
      //       setFileList([...fileList, convertedFile]);
      //       setImage(convertedFile);
      //     },
      //     error(err) {
      //       message.error("Error al convertir la imagen a PNG.");
      //       console.error(err.message);
      //     },
      //   });
      return Upload.LIST_IGNORE;
    }

    setFileList([...fileList, file]);
    setImage(file);
    return false;
  };

  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Subir</div>
    </button>
  );

  return (
    // <ImgCrop rotationSlider>
    <>
      <Upload
        listType="picture-card"
        fileList={fileList}
        onPreview={handlePreview}
        onChange={handleChange}
        beforeUpload={validateAndConvertImage}
      >
        {fileList.length >= 1 ? null : uploadButton}
      </Upload>
      {previewImage && (
        <Image
          wrapperStyle={{ display: "none" }}
          preview={{
            visible: previewOpen,
            onVisibleChange: (visible) => setPreviewOpen(visible),
            afterOpenChange: (visible) => !visible && setPreviewImage(""),
          }}
          src={previewImage}
        />
      )}
    </>
  );
};

export default LoadImage;
