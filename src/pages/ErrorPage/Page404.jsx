import React, { useEffect } from "react";
import { Button, Result } from "antd";

const Page404 = () => {
  useEffect(() => {
    document.title = "Not Found";
  }, []);
  return (
    <Result
      status="404"
      title="404"
      subTitle="Sorry, the page you visited does not exist."
      extra={
        <Button type="primary" href="/login">
          Back Home
        </Button>
      }
    />
  );
};

export default Page404;
