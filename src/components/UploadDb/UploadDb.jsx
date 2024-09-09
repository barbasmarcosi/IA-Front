import React from "react";
import { InboxOutlined, UploadOutlined } from "@ant-design/icons";
import { Button, message, Upload } from "antd";
const { Dragger } = Upload;

const UploadDb = ({ file, setFile }) => {
  const props = {
    name: "file",
    multiple: false,

    beforeUpload: () => false,
    //   action: "https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload",
    onChange(info) {
      const { status } = info.file;
      setFile(info);
      if (status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (status === "done") {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onRemove: () => {
      console.log("delete");
      setFile(false);
    },
    // defaultFileList: [
    //   {
    //     uid: "2",
    //     name: "yyy.png",
    //     status: "done",
    //     url: "http://www.baidu.com/yyy.png",
    //   },
    // ],
    // onDrop(e) {
    //   console.log("Dropped files", e.dataTransfer.files);
    //   setFile(info);
    // },
  };

  return (
    <Upload {...props} maxCount={1}>
      <Button icon={<UploadOutlined />}>Agregue su archivo</Button>
    </Upload>
  );
};
export default UploadDb;
