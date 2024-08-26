import { Button, Card, Form, InputNumber } from "antd";
import { useEffect, useRef, useState } from "react";
import LoadImage from "../components/LoadImage/LoadImage";
import { userApi } from "../api";
import VisualizeData from "../components/VisualizeData/VisualizeData";
import ResultImage from "../components/ResultImage/ResultImage";
import UploadDb from "../components/UploadDb/UploadDb";
import ColumnsCheckbox from "../components/ColumnsCheckbox/ColumnsCheckbox";

const DbAnalisis = () => {
  const [options, setOptions] = useState(null);
  const [file, setFile] = useState(null);
  const [analysisResponse, setAnalysisResponse] = useState(null);
  const [showResultImage, setShowResultImage] = useState(false);
  const [checkedColumns, setCheckedColumns] = useState(false);
  const [plainOptions, setPlainOptions] = useState([]);
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
    console.log("Enviando");
    console.log(file);
    if (file?.file) {
      formData.append("file", file.file);
    }

    userApi
      .post("uploadfile_checklist/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        console.log(res);
        setPlainOptions(res.filter(el => el != 'Unnamed: 0'))
      })
      .catch((e) => console.error(e));
  };

  const transformValues = () => {
    const formData = new FormData();
    console.log("Enviando");
    console.log(file);
    if (file?.file) {
      formData.append("file", file.file);
      formData.append("columns", [checkedColumns ? checkedColumns : plainOptions]);
    }
    console.log(file.file)
    console.log(checkedColumns ? checkedColumns : plainOptions)
    console.log(formData)

    userApi
      .post("transform_values", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        console.log(res);
        // setPlainOptions(res.filter(el => el != 'Unnamed: 0'))
      })
      .catch((e) => console.error(e));
  };

  useEffect(() => { getChecklist() }, [file])

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
          style={{ width: "50%" }}
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
          ><Form.Item
            style={{
              width: "100%",
            }}
            name="bd"
            label="Base de datos"
          >
              <UploadDb file={file} setFile={setFile} /></Form.Item>
            <Form.Item
              style={{
                width: "100%",
              }}
              name="columns"
              label="Columnas"
            >

              {plainOptions.length && <ColumnsCheckbox plainOptions={plainOptions} setCheckedColumns={setCheckedColumns} />}
            </Form.Item>

            <Form.Item style={{
              width: "100%",
            }}
              name="bits"
              label="Bits"><InputNumber /></Form.Item>
            <Button onClick={transformValues}>Analizar</Button>
          </Form>
        </Card>
      </div>
    </div >
  );
};

export default DbAnalisis;
