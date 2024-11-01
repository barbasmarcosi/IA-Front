import { Button, Card, Checkbox, Form, InputNumber, Select, Spin } from "antd";
import { useEffect, useRef, useState } from "react";
import LoadImage from "../components/LoadImage/LoadImage";
import { userApi } from "../api";
import VisualizeData from "../components/VisualizeData/VisualizeData";
import ResultImage from "../components/ResultImage/ResultImage";
import UploadDb from "../components/UploadDb/UploadDb";
import ColumnsCheckbox from "../components/ColumnsCheckbox/ColumnsCheckbox";
import DataTable from "../components/DataTable/DataTable";
import HistogramPlot from "../components/HistogramPlot/HistogramPlot";
import { useForm } from "antd/es/form/Form";

const DbAnalisis = () => {
  const [options, setOptions] = useState(null);
  const [dataToVisualize, setDataToVisualize] = useState(null);
  const [file, setFile] = useState(null);
  const [fileUrl, setFileUrl] = useState(null);
  const [checkedColumns, setCheckedColumns] = useState(false);
  const [plainOptions, setPlainOptions] = useState([]);
  const [tableData, setTableData] = useState(false);
  const [spin, setSpin] = useState(false);
  const [imageData, setImageData] = useState(null);
  const [explicitBin, setExplicitBin] = useState(false);
  const [histograma, setHistograma] = useState(false);
  const [summaryData, setSummaryData] = useState(false);
  const formRef = useRef(null);

  // const { setError, clearErrors } = useForm();

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
        console.log(JSON.parse(res.info));
        setPlainOptions(res.columns.filter((el) => el != "Unnamed: 0"));
      })
      .catch((e) => {
        console.error(e);
        message.error("Hubo un error al extraer las columnas del dataset");
      });
  };

  const transformValues = (fileData, checkedColumns) => {
    formRef.current.setFieldValue("bd", fileData);
    formRef.current.setFieldValue("columns", checkedColumns);
    formRef.current
      .validateFields()
      .then(() => {
        const formData = new FormData();
        console.log("Enviando");
        console.log(file);
        console.log(formRef.current.getFieldsValue());
        if (file?.file) {
          formData.append("file", file.file);
          formData.append("columns", [checkedColumns]);
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
          .post("transform_values", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
          .then((res) => {
            // console.log(res);
            setDataToVisualize(res.result);
            // console.log(res.table);
            // console.log(JSON.parse(res.table));
            setTableData(JSON.parse(res.table));
            setFileUrl(res.file_url);
            setImageData(res.graphics);
            console.log("res.clusters");
            console.log(res.clusters);
            setSummaryData(res.clusters?.Summary);
            //{CardinalityDispersion: 3, ClusterizedHyperBins: 130, TotalClusters: 3}
            // setPlainOptions(res.filter(el => el != 'Unnamed: 0'))
          })
          .catch((e) => {
            console.log(e);
            console.error(e);
            message.error("Hubo un error al analizar la información");
            setDataToVisualize(false);
            setTableData(false);
            setFileUrl(false);
          });
      })
      .catch((err) => {
        console.log(err);
        return false;
      });
  };

  useEffect(() => {
    getChecklist();
  }, [file]);

  useEffect(() => {
    setSpin(true);
    if (!!file) {
      setPlainOptions(false);
      setDataToVisualize(false);
      setTableData(false);
      setFileUrl(false);
      setImageData(null);
    }
    setTimeout(() => {
      setSpin(false);
    }, [1]);
  }, [file]);

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
          // flexDirection: "row",
          // alignItems: "center",
        }}
      >
        <Card
          // style={{ width: "48vw", height: '20vh' }}
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
              height: "50vh",
            }}
            ref={formRef}
          >
            <Form.Item
              style={{
                width: "100%",
              }}
              name="bd"
              label="Base de datos"
              rules={[
                {
                  required: true,
                  message: "Por favor ingrese un archivo con los datos",
                },
              ]}
            >
              <UploadDb file={file} setFile={setFile} />
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
            {spin ? (
              <Spin />
            ) : (
              <>
                <Form.Item
                  style={{
                    width: "100%",
                    // minHeight: "50%",
                    // maxWidth:
                  }}
                  name="columns"
                  label="Columnas"
                  rules={[
                    {
                      required: true,
                      message: "Por favor seleccione las columnas a analizar",
                    },
                  ]}
                >
                  {!!plainOptions.length && !!file && (
                    <ColumnsCheckbox
                      plainOptions={plainOptions}
                      setCheckedColumns={setCheckedColumns}
                    />
                  )}
                </Form.Item>

                <Form.Item
                  style={{
                    width: "100%",
                  }}
                  name="bits"
                  label="Bits"
                >
                  <Select
                    defaultValue={8}
                    options={[
                      { label: 8, value: 8 },
                      { label: 16, value: 16 },
                      // { label: 32, value: 32 },
                    ]}
                  />
                </Form.Item>
                <Button
                  type="primary"
                  onClick={() => {
                    console.log("file, checkedColumns");
                    console.log(file, checkedColumns);
                    transformValues(file, checkedColumns);
                  }}
                >
                  Analizar
                </Button>
              </>
            )}
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
        <HistogramPlot
          imageData={imageData}
          setImageData={setImageData}
          style={{
            width: "60vw",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        />
      </div>
      {tableData && (
        <DataTable
          columns={checkedColumns ? checkedColumns : plainOptions}
          data={tableData}
          fileUrl={fileUrl}
        />
      )}
    </div>
  );
};

export default DbAnalisis;
