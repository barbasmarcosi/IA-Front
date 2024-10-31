import { Button, Card, Checkbox, Form, InputNumber, message } from "antd";
import { useRef, useState } from "react";
import LoadImage from "../components/LoadImage/LoadImage";
import { userApi } from "../api";
import VisualizeData from "../components/VisualizeData/VisualizeData";
import ResultImage from "../components/ResultImage/ResultImage";

const ImageAnalisis = () => {
  const [image, setImage] = useState(null);
  const [analysisResponse, setAnalysisResponse] = useState(null);
  const [showResultImage, setShowResultImage] = useState(false);
  const [resultImagePath, setResultImagePath] = useState(false);
  const formRef = useRef(null);

  const analyzeImage = () => {
    const formData = new FormData();
    const formValues = formRef.current.getFieldsValue();
    if (image?.originFileObj) {
      formData.append("file", image.originFileObj);
    }

    userApi
      .post("generate_image/", formData, {
        params: {
          min_clusters: formValues.min,
          max_clusters: formValues.max,
        },
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        console.log(res);
        console.log(res.image);
        setShowResultImage(false);
        setAnalysisResponse(res);
        setResultImagePath(res.image);
        setTimeout(() => {
          setShowResultImage(true);
        }, [1000]);
      })
      .catch((e) =>
        message.error("Hubo un error con su imagen, pruebe con otra")
      );
  };

  return (
    <div
      style={{
        width: "96vw",
        overflowX: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: "96vw",
          overflowX: "hidden",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Card
          style={{ width: "50%", height: "40vh" }}
          title={"Complete para analizar utilizando FAUM"}
        >
          <Form
            style={{
              width: "100%",
              overflowX: "hidden",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
            ref={formRef}
          >
            <Form.Item
              style={{
                width: "100%",
                marginLeft: "2rem",
              }}
              name="imagenes"
              label="Imagen"
            >
              <LoadImage image={image} setImage={setImage} />
              <Checkbox>Histograma</Checkbox>
            </Form.Item>
            <div>
              <Form.Item
                style={{
                  width: "100%",
                }}
                name="min"
                label="Clusters mínimos"
              >
                <InputNumber
                  style={{
                    width: "100%",
                  }}
                  min={1}
                />
              </Form.Item>
              <Form.Item
                style={{
                  width: "40vw",
                }}
                name="max"
                label="Clusters máximos"
              >
                <InputNumber
                  style={{
                    width: "100%",
                  }}
                  min={1}
                />
              </Form.Item>
            </div>
            <Button onClick={analyzeImage}>Analizar</Button>
          </Form>
        </Card>
        <Card
          style={{ width: "50%", height: "40vh" }}
          title={"Imagen clusterizada"}
        >
          {showResultImage && (
            <ResultImage
              showResultImage={showResultImage}
              resultImagePath={resultImagePath}
            />
          )}
        </Card>
      </div>
      {analysisResponse && <VisualizeData data={analysisResponse} />}
    </div>
  );
};

export default ImageAnalisis;
