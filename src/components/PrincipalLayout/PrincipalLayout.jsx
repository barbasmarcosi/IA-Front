import { DollarOutlined, FileOutlined, HomeOutlined } from "@ant-design/icons";
import {
  Breadcrumb,
  Button,
  Input,
  Layout,
  Menu,
  message,
  Modal,
  Spin,
} from "antd";
// import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_COOKIE_URL } from "../../global";
const { Header, Content, Sider } = Layout;
import "./styles.css";
import { userApi } from "../../api";

const getItem = (label, key, icon, children) => {
  return {
    key,
    icon,
    children,
    label,
  };
};

const items = [
  getItem("Analisis de imagenes", "image_analisis", <HomeOutlined />),
  getItem("Analisis de base de datos", "db_analisis", <HomeOutlined />),
  // getItem("Motores", "engines", <MediumOutlined />),
  // getItem("IVA", "iva_types", <DollarOutlined />),
];

const PrincipalLayout = ({
  children,
  addingZone,
  addingCamera,
  zones,
  center,
  cameras,
  user,
  setUser,
}) => {
  // const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [spin, setSpin] = useState(false);
  const [reload, setReload] = useState(false);
  const [component, setComponent] = useState(false);
  // const [user, setUser] = useState(proveedor.user);
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [selectedTab, setSelectedTab] = useState("");
  const navigate = useNavigate();
  // console.log("render");
  const error = (content) => {
    message.error({
      style: { fontSize: "1rem" },
      content: content,
      key: 3,
      duration: 5,
    });
  };
  // console.log(selectedNav);
  const success = (content) => {
    message.success({
      style: { fontSize: "1rem" },
      content: content,
      key: 3,
      duration: 5,
    });
  };

  const content = () => (
    // true ? (
    <Layout
      style={{
        minHeight: "100vh",
        zIndex: 10000,
      }}
    >
      <Header
        style={{
          width: "100vw",
          paddingLeft: "1vw",
          height: "64px",
          position: "sticky",
          fontSize: "1vw",
          top: 0,
          left: 0,
          zIndex: 1000,
        }}
        className="header"
      >
        <Menu
          theme="dark"
          style={{ width: "100%" }}
          onClick={(e) => {
            navigate(`/${e.key}`);
            // navigate(`/${e.key}`);
            localStorage.setItem("selectedTab", JSON.stringify({ key: e.key }));
            setSelectedTab(e.key);
            setReload(!reload);
          }}
          defaultSelectedKeys={[selectedTab]}
          mode="horizontal"
          items={items}
        />
      </Header>

      <Layout className="site-layout">
        <Content
          style={{
            margin: "2rem",
            zIndex: 100,
          }}
        >
          <Breadcrumb
          // style={{
          //   margin: "16px 0",
          // }}
          />
          <div
            className="site-layout-background"
            // style={{
            //   padding: 0,
            //   minHeight: 360,

            // }}
          >
            {children}
          </div>
        </Content>
      </Layout>
      <Modal
        title="Cambiar contraseña"
        centered
        open={isModalOpen}
        cancelText={"Cancelar"}
        destroyOnClose={true}
        width="40%"
        onOk={() => {
          if (password === repeatPassword && password.length) {
            userApi
              .patch(`/users/${user.user_nid}/`, {
                password: password,
                mustChangePassword: false,
              })
              .then(() => {
                setSpin(true);
                success("Su contraseña fue modificada correctamente");
                // setProveedor({ ...proveedor });
                setPassword("");
              })
              .catch(() => {
                setSpin(true);
                error(
                  "Hubo un problema al intentar modificar la constraseña, intente más tarde"
                );
              })
              .finally(() => {
                setSpin(false);
                setIsModalOpen(false);
                setReload(!reload);
              });
          } else {
            error("Las constraseñas no coinciden");
          }
        }}
        onCancel={() => {
          setIsModalOpen(false);
          setReload(!reload);
        }}
      >
        {/* <p>Ingresá tu contraseña actual</p>
        <Input.Password placeholder="Contraseña actual" />
        <p> </p> */}
        <p>Ingresá tu nueva contraseña</p>
        <Input.Password
          placeholder="Nueva contraseña"
          onChange={(e) => {
            setPassword(e.target.value);
            setReload(!reload);
            // console.log(password);
          }}
        />
        <p> </p>
        <p>Repetí tu nueva contraseña</p>
        <Input.Password
          placeholder="Nueva contraseña"
          onChange={(e) => {
            setRepeatPassword(e.target.value);
            setReload(!reload);
          }}
        />
        {spin && (
          // <CenterHorizontally>
          <Spin />
          // </CenterHorizontally>
        )}
      </Modal>
    </Layout>
  );
  // ) : (
  //   false
  // );
  const checkLS = async () => {
    return !!(
      sessionStorage.getItem("user") || sessionStorage.getItem("proveedor")
    );
  };

  const setContent = async () => {
    // const isLogged = await checkLS();
    // if (isLogged) {
    setComponent(content());
    // } else {
    // setComponent(<div>{children}</div>);
    // }
  };

  useEffect(() => {
    setContent();
  }, [addingZone, addingCamera, zones, center, cameras, user, reload]);
  return <>{component}</>;
};
export default PrincipalLayout;
