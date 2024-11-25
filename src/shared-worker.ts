interface Message {
  type: "draw" | "init";
  data: any;
}

let connections: MessagePort[] = [];
let drawingPaths: { x: number; y: number }[][] = [];

// Handle connections from multiple tabs
onconnect = (event: MessageEvent) => {
  const port = event.ports[0];
  connections.push(port);

  console.log("Connection established with", connections.length, "clients");

  // Send existing paths to new connection
  port.postMessage({ type: "init", data: drawingPaths });

  port.onmessage = (e: MessageEvent<Message>) => {
    const { type, data } = e.data;

    if (type === "draw") {
      // 데이터를 단일 포인트 배열로 저장
      drawingPaths.push(data); // data는 [{ x, y }] 형태

      // 각 연결된 클라이언트에게 브로드캐스트
      connections.forEach((conn) => {
        if (conn !== port) {
          // 자기 자신에게는 전송하지 않음
          conn.postMessage({ type: "draw", data }); // data 그대로 전달
        }
      });
    }

    if (type === "clear") {
      drawingPaths = [];
      connections.forEach((conn) => {
        conn.postMessage({ type: "clear" });
      });
    }
  };

  // Handle disconnection
  port.onclose = () => {
    connections = connections.filter((conn) => conn !== port);
  };
};
