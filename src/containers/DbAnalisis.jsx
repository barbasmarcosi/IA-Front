import { Button, Card, Form, InputNumber, Select, Spin } from "antd";
import { useEffect, useRef, useState } from "react";
import LoadImage from "../components/LoadImage/LoadImage";
import { userApi } from "../api";
import VisualizeData from "../components/VisualizeData/VisualizeData";
import ResultImage from "../components/ResultImage/ResultImage";
import UploadDb from "../components/UploadDb/UploadDb";
import ColumnsCheckbox from "../components/ColumnsCheckbox/ColumnsCheckbox";
import DataTable from "../components/DataTable/DataTable";

const DbAnalisis = () => {
  const [options, setOptions] = useState(null);
  const [dataToVisualize, setDataToVisualize] = useState(null);
  const [file, setFile] = useState(null);
  const [fileUrl, setFileUrl] = useState(null);
  const [checkedColumns, setCheckedColumns] = useState(false);
  const [plainOptions, setPlainOptions] = useState([]);
  const [tableData, setTableData] = useState(false);
  const [spin, setSpin] = useState(false);
  const formRef = useRef(null);

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
      .catch((e) => console.error(e));
  };

  const transformValues = () => {
    const formData = new FormData();
    console.log("Enviando");
    console.log(file);
    if (file?.file) {
      formData.append("file", file.file);
      formData.append("columns", [checkedColumns]);
      formData.append(
        "bits",
        formRef.current.getFieldValue("bits")
          ? formRef.current.getFieldValue("bits")
          : 8
      );
    }
    console.log(file.file);
    console.log(checkedColumns);
    console.log(formData);

    userApi
      .post("transform_values", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        console.log(res);
        setDataToVisualize(res.result);
        console.log(res.table);
        console.log(JSON.parse(res.table));
        setTableData(JSON.parse(res.table));
        setFileUrl(res.file_url);
        // setPlainOptions(res.filter(el => el != 'Unnamed: 0'))
      })
      .catch((e) => {
        console.log(e);
        console.error(e);
        setDataToVisualize(false);
        setTableData(false);
        setFileUrl(false);
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
              alignItems: "center",
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
            >
              <UploadDb file={file} setFile={setFile} />
            </Form.Item>
            {spin ? (
              <Spin />
            ) : (
              <>
                <Form.Item
                  style={{
                    width: "100%",
                    minHeight: "50%",
                  }}
                  name="columns"
                  label="Columnas"
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
                <Button type="primary" onClick={transformValues}>
                  Analizar
                </Button>
              </>
            )}
          </Form>
        </Card>
        {dataToVisualize ? (
          <VisualizeData data={dataToVisualize} />
        ) : (
          <div style={{ width: "50vw", height: "50vh" }} />
        )}
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
