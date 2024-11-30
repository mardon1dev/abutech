import type { FormProps } from "antd";
import { Button, Form, Input } from "antd";
import { useAxios } from "../hooks/useAxios";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

import LoginImage from "../assets/login-image.jpg";
import Logo from "../assets/logo.svg";

type FieldType = {
  login?: string;
  password?: string;
};

const Login: React.FC = () => {
  const navigate = useNavigate();
  const axiosInstance = useAxios();

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    try {
      const response = await axiosInstance.post(`/auth/sign-in`, values);

      if (response?.data?.data?.accessToken) {
        localStorage.setItem("access_token", response?.data?.data?.accessToken);
        toast.success("Login successful!");
        navigate("/contracts");
      }
    } catch (error: any) {
      if (error.response?.status === 400) {
        toast.error(error.response.data.error.errMsg);
      } else {
        console.error("Login error:", error);
      }
    }
  };

  const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (
    errorInfo
  ) => {
    console.error("Failed:", errorInfo);
  };

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <div className="w-full h-screen flex items-center">
        <div className="max-w-[600px] w-full h-full sm:block hidden">
          <img
            src={LoginImage}
            alt="Abut Tech"
            width={600}
            height={"100vh"}
            className="h-screen w-full object-cover"
          />
        </div>
        <div className="pt-[60px] px-[60px] relative flex items-center h-full w-full sm:justify-start justify-center">
          <img
            src={Logo}
            alt="Najot Ta'lim"
            width={202}
            height={41}
            className="h-[41px] absolute top-[64px]"
          />
          <div className="w-full">
            <h2 className="py-5 sm:text-[32px] text-[24px] leading-[48px] font-semibold sm:text-left text-center">
              Tizimga kirish
            </h2>
            <Form
              name="basic"
              initialValues={{ remember: true }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
              layout="vertical"
              className="sm:w-[380px] w-full"
            >
              <Form.Item
                label="Login"
                name="login"
                rules={[
                  { required: true, message: "Please enter your login!" },
                ]}
                className="font-semibold caret-green-700 caret-thick"
              >
                <Input className={`py-3 px-4`} placeholder="Enter your login" />
              </Form.Item>
              <Form.Item
                label="Password"
                name="password"
                rules={[
                  { required: true, message: "Please enter your password!" },
                ]}
                className="font-semibold"
              >
                <Input.Password
                  className="py-3 px-4  caret-thick caret-green-600"
                  placeholder="Enter your password"
                />
              </Form.Item>
              <Form.Item>
                <Button
                  type="default"
                  htmlType="submit"
                  style={{
                    backgroundColor: "#0EB182",
                    color: "#fff",
                    border: "none",
                    marginTop: "10px",
                    borderRadius: "5px",
                    cursor: "pointer",
                    width: "100%",
                    height: "45px",
                  }}
                >
                  <span className="!py-3 !px-4">Kirish</span>
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
