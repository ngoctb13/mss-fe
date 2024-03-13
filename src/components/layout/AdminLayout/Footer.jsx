import React from "react";
import { Layout } from "antd";

const { Footer } = Layout;

const AdFooter = () => {
  return (
    <Footer
      style={{
        textAlign: "center",
      }}
    >
      FPT University ©{new Date().getFullYear()} Created by G50
    </Footer>
  );
};

export default AdFooter;
