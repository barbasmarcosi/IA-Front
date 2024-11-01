import { Button, Card, Checkbox, Form, InputNumber, message } from "antd";
import { useRef, useState } from "react";
import LoadImage from "../components/LoadImage/LoadImage";
import { userApi } from "../api";
import VisualizeData from "../components/VisualizeData/VisualizeData";
import ResultImage from "../components/ResultImage/ResultImage";
import HistogramPlot from "../components/HistogramPlot/HistogramPlot";

const ImageAnalisis = () => {
  const [image, setImage] = useState(null);
  const [analysisResponse, setAnalysisResponse] = useState(null);
  const [showResultImage, setShowResultImage] = useState(false);
  const [resultImagePath, setResultImagePath] = useState(false);
  const [tableData, setTableData] = useState(false);
  const [spin, setSpin] = useState(false);
  const [imageData, setImageData] = useState(null);
  const [explicitBin, setExplicitBin] = useState(false);
  const [histograma, setHistograma] = useState(false);
  const [summaryData, setSummaryData] = useState(false);
  const [fileUrl, setFileUrl] = useState(false);
  const formRef = useRef(null);

  const analyzeImage = (image) => {
    // const formData = ;
    console.log(image?.originFileObj);
    formRef.current.setFieldValue("imagen", image?.originFileObj);

    formRef.current
      .validateFields()
      .then(() => {
        const formData = new FormData();
        console.log("Enviando");
        // console.log(file);
        console.log(formRef.current.getFieldsValue());
        if (image.originFileObj) {
          formData.append("file", image.originFileObj);
          // formData.append("columns", [checkedColumns]);
          if (formRef.current.getFieldValue("min_clusters")) {
            formData.append(
              "min_clusters",
              formRef.current.getFieldValue("min_clusters")
            );
          }
          if (formRef.current.getFieldValue("max_clusters")) {
            formData.append(
              "max_clusters",
              formRef.current.getFieldValue("max_clusters")
            );
          }
          formData.append(
            "bits",
            formRef.current.getFieldValue("bits")
              ? formRef.current.getFieldValue("bits")
              : 8
          );
          if (explicitBin) {
            formData.append("explicit_bin", 1);
            formData.append(
              "binsize",
              formRef.current.getFieldValue("binsize")
            );
            formData.append(
              "bin_distance",
              formRef.current.getFieldValue("bin_distance")
            );
          }
          formData.append("histograma", histograma ? 1 : 0);
        }
        userApi
          .post("generate_image/", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
          .then((res) => {
            // console.log(res);
            // setDataToVisualize(res.result);
            // console.log(res.table);
            // console.log(JSON.parse(res.table));
            // setTableData(JSON.parse(res.table));
            setFileUrl(res.file_url);
            setImageData(res.graphics);
            setSummaryData(res.clusters?.Summary);
            setShowResultImage(false);
            setAnalysisResponse(res);
            setResultImagePath(res.image);
            setTimeout(() => {
              setShowResultImage(true);
            }, [1000]);
            //{CardinalityDispersion: 3, ClusterizedHyperBins: 130, TotalClusters: 3}
            // setPlainOptions(res.filter(el => el != 'Unnamed: 0'))
          })
          .catch((e) => {
            console.log(e);
            console.error(e);
            message.error(
              "Hubo un error al analizar la imagen, por favor verique que el formato sea PNG"
            );
            // setDataToVisualize(false);
            setTableData(false);
            setFileUrl(false);
          });
      })
      .catch((err) => {
        console.log(err);
        return false;
      });
  };
  // const analyzeImage = () => {
  //   const formData = new FormData();
  //   const formValues = formRef.current.getFieldsValue();
  //   if (image?.originFileObj) {
  //     formData.append("file", image.originFileObj);
  //   }

  //   userApi
  //     .post("generate_image/", formData, {
  //       params: {
  //         min_clusters: formValues.min,
  //         max_clusters: formValues.max,
  //       },
  //       headers: {
  //         "Content-Type": "multipart/form-data",
  //       },
  //     })
  //     .then((res) => {
  //       console.log(res);
  //       console.log(res.image);
  //       setShowResultImage(false);
  //       setAnalysisResponse(res);
  //       setResultImagePath(res.image);
  //       setTimeout(() => {
  //         setShowResultImage(true);
  //       }, [1000]);
  //     })
  //     .catch((e) =>
  //       message.error("Hubo un error con su imagen, pruebe con otra")
  //     );
  // };

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
          style={{ width: "50%", height: "75vh" }}
          title={"Complete para analizar utilizando FAUM"}
        >
          <Form
            style={{
              width: "100%",
              overflowX: "hidden",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-around",
              alignItems: "left",
              width: "40vw",
              // height: "100vh",
            }}
            ref={formRef}
          >
            <Form.Item
              style={{
                width: "100%",
                // marginLeft: "2rem",
              }}
              rules={[
                {
                  required: true,
                  message: "Por favor ingrese una imagen en formato PNG",
                  // type: "",
                },
              ]}
              name="imagen"
              label="Imagen"
            >
              <LoadImage image={image} setImage={setImage} />
            </Form.Item>
            <Form.Item name="histograma">
              <Checkbox onChange={(e) => setHistograma(e.target.checked)}>
                Histograma
              </Checkbox>
            </Form.Item>
            <Form.Item name="min_clusters" label="Nro. clusters mínimos">
              <InputNumber />
            </Form.Item>
            <Form.Item name="max_clusters" label="Nro. clusters máximo">
              <InputNumber />
            </Form.Item>
            <Form.Item name="explicit_bin">
              <Checkbox
                value={explicitBin}
                onChange={(value) => {
                  console.log(value.target.checked);
                  setExplicitBin(value.target.checked);
                }}
              >
                Explicitar datos de bin
              </Checkbox>
            </Form.Item>
            {!!explicitBin && (
              <>
                <Form.Item
                  name="binsize"
                  label="Tamaño de bin"
                  rules={[
                    {
                      required: true,
                      message: "Por favor ingrese el tamaño de bin",
                      type: "number",
                    },
                  ]}
                >
                  <InputNumber disabled={!explicitBin} />
                </Form.Item>
                <Form.Item
                  name="bin_distance"
                  label="Distancia entre bines"
                  rules={[
                    {
                      required: true,
                      message: "Por favor ingrese la distancia entre bines",
                      type: "number",
                    },
                  ]}
                >
                  <InputNumber disabled={!explicitBin} />
                </Form.Item>
              </>
            )}
            <Button onClick={() => analyzeImage(image)}>Analizar</Button>
          </Form>
          {summaryData && (
            <>
              <h4>Dispersion cardinal: {summaryData?.CardinalityDispersion}</h4>
              <h4>
                Hiper bins clusterizados: {summaryData?.ClusterizedHyperBins}
              </h4>
              <h4>Total de clusters: {summaryData?.TotalClusters}</h4>
            </>
          )}
        </Card>
        <Card
          style={{ width: "50%", height: "75vh" }}
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
      {/* {analysisResponse && <VisualizeData data={analysisResponse} />} */}
      {/* {imageData && ( */}
      <HistogramPlot
        imageData={imageData}
        setImageData={setImageData}
        style={{
          width: "100vw",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      />
      {/* )} */}
    </div>
  );
};

export default ImageAnalisis;
