import { useRouteError } from "react-router-dom";
import { Button } from "antd";
/**
 * 渲染错误边界组件
 */
function ErrorBoundary() {
  const error: any = useRouteError();

  return (
    <div style={{ width: "80%", margin: "100px auto" }}>
      <h1>{error.name}：渲染失败，请检查:</h1>
      <p style={{ lineHeight: "30px", color: "red", marginBottom: 20 }}>
        {error.stack}
      </p>
      <Button type="primary" onClick={() => location.reload()}>
        Try again
      </Button>
    </div>
  );
}

export default ErrorBoundary;
