import { LockOutlined, UserOutlined, MailOutlined } from "@ant-design/icons";
import { Alert, Button, Form, Input, message, Modal, Spin } from "antd";
import React, { useEffect, useRef } from "react";
import { useState } from "react";
import {
  Row,
  CenterHorizontally,
  Column,
  OptionButton,
  OptionsContainer,
} from "./styles";
import { useNavigate } from "react-router-dom";

import { userApi } from "../../api";
import { API_COOKIE_URL, BASE_URL } from "../../global";

const errorInitialState = "";

const Login = ({ user, setUser }) => {
  const [modal, setModal] = useState(false);
  const [content, setContent] = useState("login");
  const navigate = useNavigate();
  const [spin, setSpin] = useState(false);
  const [error, setError] = useState(errorInitialState);
  // const [toRender, setToRender] = useState();

  useEffect(() => {
    // console.log(user);
    if (user && user.applications.filter((app) => app.nid == -15).length) {
      // setError("No posee permisos para esta aplicación");
      navigate(`${BASE_URL}/map`);
    }
  }, []);

  const success = (content) => {
    message.success({
      style: { fontSize: "1rem" },
      content: content,
      key: 2,
      duration: 10,
    });
  };

  const userInput = useRef(null);

  const handleSubmit = (values) => {
    setSpin(true);
    content === "login" ? doLogin(values) : false;
  };
  const doLogin = async (values) => {
    setError(errorInitialState);
    userApi
      .post("users/auth", { usuario: values.user, password: values.password })
      .then((response) => {
        navigate(`${BASE_URL}/map`);
        // setAuth(true);
        if (!response.applications.filter((app) => app.nid == -15).length) {
          setError("No posee permisos para esta aplicación");
        }
        localStorage.setItem("user", JSON.stringify(response));
        setUser(response);
        // console.log(API_COOKIE_URL);
        document.cookie = `user=${JSON.stringify(
          response
        )}; domain=.${API_COOKIE_URL}; path=/`;
      })
      .catch((error) => {
        setError(error);
      })
      .finally(() => {
        setSpin(false);
      });
  };
  return (
    <Row>
      <Column>
        <img
          alt="logo"
          src={"logo_login.png"}
          style={{ width: "100%", marginBottom: "20px" }}
        />
        <Form style={{ width: "100%" }} onFinish={handleSubmit} disabled={spin}>
          <Form.Item
            name="user"
            rules={[
              {
                required: true,
                // message: "Formato de CUIT inválido",
                // pattern: /^(20|23|27|30|33)-[0-9]{8}-[0-9]{1}$/,
              },
            ]}
          >
            <Input
              ref={userInput}
              prefix={<UserOutlined className="input-icon" />}
              placeholder="Legajo"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: "Ingresá la contraseña" }]}
          >
            <Input.Password
              prefix={<LockOutlined className="input-icon" />}
              placeholder="Contraseña"
            />
          </Form.Item>
          <Form.Item>
            <Button style={{ width: "100%" }} type="primary" htmlType="submit">
              Iniciar sesión
            </Button>
          </Form.Item>
        </Form>
        {spin && (
          <CenterHorizontally>
            <Spin />
          </CenterHorizontally>
        )}
        {error && <Alert message={error} type="error" showIcon />}
      </Column>

      {/* <Modal
        title={modalTitle}
        centered
        open={modal}
        destroyOnClose={true}
        cancelText={"Cancelar"}
        width="40%"
        okButtonProps={{ disabled: acceptModal }}
        onOk={() => onAcceptModalButton()}
        onCancel={() => setModal(false)}
      >
        {modalContent.length
          ? modalContent.map((content) => <p>{content}</p>)
          : false}
      </Modal> */}
    </Row>
  );
};

export default Login;
