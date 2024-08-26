import { Button, Card, Form, InputNumber } from "antd";
import { useRef, useState } from "react";
import LoadImage from "../components/LoadImage/LoadImage";
import { userApi } from "../api";
import VisualizeData from "../components/VisualizeData/VisualizeData";
import ResultImage from "../components/ResultImage/ResultImage";
import UploadDb from "../components/UploadDb/UploadDb";

const DbAnalisis = () => {
  const [options, setOptions] = useState(null);
  const [file, setFile] = useState(null);
  const [analysisResponse, setAnalysisResponse] = useState(null);
  const [showResultImage, setShowResultImage] = useState(false);
  const formRef = useRef(null);

  const htmlToJson = (htmlString) => {
    // Crear un elemento temporal para contener el HTML
    const tempElement = document.createElement("div");
    tempElement.innerHTML = htmlString;

    // Seleccionar todos los inputs de tipo checkbox
    const checkboxes = tempElement.querySelectorAll('input[type="checkbox"]');

    // Mapear cada checkbox a un objeto JSON
    const jsonResult = Array.from(checkboxes).map((checkbox) => {
      return {
        label: checkbox.nextSibling.textContent.trim(), // El texto que sigue al input
        value: checkbox.value, // El valor del input
      };
    });

    return jsonResult;
  };

  const getChecklist = () => {
    const formData = new FormData();
    const formValues = formRef.current.getFieldsValue();
    // console.log("Enviando");
    console.log("file");
    console.log(file);
    console.log("file?.originFileObj");
    // console.log(file?.originFileObj);
    if (file) {
      formData.append("file", file); // Usa el archivo real
      formData.append("body", file); // Usa el archivo real
    }
    formData.append("min", formValues.min);
    // formData.append("max", formValues.max);

    userApi
      .post("uploadfile_checklist", formData, {
        //   params: {
        //     min_clusters: formValues.min,
        //     max_clusters: formValues.max,
        //   },
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        console.log(res);
        console.log(htmlToJson(res));
        setOptions(htmlToJson(res));
        setShowResultImage(false);
        setAnalysisResponse(res);
        setTimeout(() => {
          setShowResultImage(true);
        }, [1000]);
      })
      .catch((e) => console.error(e));
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
            <UploadDb file={file} setFile={setFile} />
            {/* <Form.Item
              style={{
                width: "100%",
                marginLeft: "2rem",
              }}
              name="imagenes"
              label="Imagen"
            >
              <LoadImage image={image} setImage={setImage} />
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
            </div> */}
            <Button onClick={getChecklist}>Analizar</Button>
          </Form>
        </Card>
        {/* <Card
          style={{ width: "50%", height: "40vh" }}
          title={"Imagen clusterizada"}
        >
          {showResultImage && <ResultImage showResultImage={showResultImage} />}
        </Card> */}
      </div>
      {/* {analysisResponse && <VisualizeData data={analysisResponse} />} */}
    </div>
  );
};

export default DbAnalisis;
