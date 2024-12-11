import React, { useEffect, useState } from "react";
import { Statistic, Card, Row, Col, Table, Spin, message } from "antd";
import { Pie, Bar } from "@ant-design/charts";
import axios from "axios";
import "../styles/Estadisticas.css";
import { useNavigate } from "react-router-dom";

export default function Estadisticas() {
  const [stats, setStats] = useState({
    total: 0,
    abiertos: 0,
    enProgreso: 0,
    resueltos: 0,
    cerrados: 0,
    abiertosUltimoMes: 0,
    cerradosUltimoMes: 0,
    abiertosMasTresMeses: 0,
  });
  const [ticketData, setTicketData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/tickets");
        const tickets = response.data;

        if (!Array.isArray(tickets)) {
          throw new Error("La respuesta de la API no es un arreglo");
        }

        const now = new Date();
        const ultimoMes = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
        const tresMesesAtras = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());

        // Calcular estadísticas
        const total = tickets.length;
        const abiertos = tickets.filter((t) => t.estado === "Abierto").length;
        const enProgreso = tickets.filter((t) => t.estado === "En Proceso").length;
        const resueltos = tickets.filter((t) => t.estado === "Resuelto").length;
        const cerrados = tickets.filter((t) => t.estado === "Cerrado").length;

        const abiertosUltimoMes = tickets.filter(
          (t) => t.estado === "Abierto" && new Date(t.fecha_creacion) >= ultimoMes
        ).length;

        const cerradosUltimoMes = tickets.filter(
          (t) => t.estado === "Cerrado" && new Date(t.fecha_creacion) >= ultimoMes
        ).length;

        const abiertosMasTresMeses = tickets.filter(
          (t) => t.estado === "Abierto" && new Date(t.fecha_creacion) < tresMesesAtras
        ).length;

        setStats({
          total,
          abiertos,
          enProgreso,
          resueltos,
          cerrados,
          abiertosUltimoMes,
          cerradosUltimoMes,
          abiertosMasTresMeses,
        });

        setTicketData(tickets);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching tickets:", error);
        message.error("Error al cargar las estadísticas.");
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const columns = [
    { title: "ID", dataIndex: "id_ticket", key: "id_ticket" },
    { title: "Descripción", dataIndex: "descripcion", key: "descripcion" },
    { title: "Dirección", dataIndex: "direccion", key: "direccion" },
    { title: "Estado", dataIndex: "estado", key: "estado" },
    {
      title: "Fecha de Creación",
      dataIndex: "fecha_creacion",
      key: "fecha_creacion",
      render: (text) => new Date(text).toLocaleDateString("es-MX"),
    },
  ];

  const pieData = [
    { type: "Abiertos", value: stats.abiertos },
    { type: "En Progreso", value: stats.enProgreso },
    { type: "Resueltos", value: stats.resueltos },
    { type: "Cerrados", value: stats.cerrados },
  ];

  const pieConfig = {
    appendPadding: 10,
    data: pieData,
    angleField: "value",
    colorField: "type",
    radius: 0.8,
    label: {
      type: "spider",
      labelHeight: 28,
      content: "{name} {percentage}",
    },
    interactions: [{ type: "element-active" }],
  };

  const barData = [
    { category: "Total Tickets", value: stats.total },
    { category: "Abiertos", value: stats.abiertos },
    { category: "En Progreso", value: stats.enProgreso },
    { category: "Resueltos", value: stats.resueltos },
    { category: "Cerrados", value: stats.cerrados },
    { category: "Abiertos Último Mes", value: stats.abiertosUltimoMes },
    { category: "Cerrados Último Mes", value: stats.cerradosUltimoMes },
    { category: "Abiertos > 3 Meses", value: stats.abiertosMasTresMeses },
  ];

  const barConfig = {
    data: barData,
    xField: "value",
    yField: "category",
    seriesField: "category",
    legend: false,
    label: { position: "middle", style: { fill: "#fff" } },
  };

  return (
    <div className="estadisticas-container">
      <h2>Estadísticas</h2>
      {loading ? (
        <Spin size="large" />
      ) : (
        <>
          <Row gutter={16}>
            <Col span={5}>
              <Card onClick={() => navigate("/solicitudes")} style={{ cursor: "pointer" }}>
                <Statistic title="Total Tickets" value={stats.total} />
              </Card>
            </Col>
            <Col span={5}>
              <Card onClick={() => navigate("/solicitudes")} style={{ cursor: "pointer" }}>
                <Statistic title="Tickets Abiertos" value={stats.abiertos} />
              </Card>
            </Col>
            <Col span={5}>
              <Card onClick={() => navigate("/solicitudes")} style={{ cursor: "pointer" }}>
                <Statistic title="Tickets en Progreso" value={stats.enProgreso} />
              </Card>
            </Col>
            <Col span={5}>
              <Card onClick={() => navigate("/solicitudes")} style={{ cursor: "pointer" }}>
                <Statistic title="Tickets Resueltos" value={stats.resueltos} />
              </Card>
            </Col>
            <Col span={5}>
              <Card onClick={() => navigate("/solicitudes")} style={{ cursor: "pointer" }}>
                <Statistic title="Tickets Cerrados" value={stats.cerrados} />
              </Card>
            </Col>
            <Col span={5}>
              <Card onClick={() => navigate("/solicitudes")} style={{ cursor: "pointer" }}>
                <Statistic title="Abiertos Último Mes" value={stats.abiertosUltimoMes} />
              </Card>
            </Col>
            <Col span={5}>
              <Card onClick={() => navigate("/solicitudes")} style={{ cursor: "pointer" }}>
                <Statistic title="Cerrados Último Mes" value={stats.cerradosUltimoMes} />
              </Card>
            </Col>
            <Col span={5}>
              <Card onClick={() => navigate("/solicitudes")} style={{ cursor: "pointer" }}>
                <Statistic title="Abiertos > 3 Meses" value={stats.abiertosMasTresMeses} />
              </Card>
            </Col>
          </Row>

          <Row gutter={16} style={{ marginTop: "20px" }}>
            <Col span={12}>
              <Card title="Distribución de Tickets" bordered={false}>
                <Pie {...pieConfig} />
              </Card>
            </Col>
            <Col span={12}>
              <Card title="Resumen de Tickets" bordered={false}>
                <Bar {...barConfig} />
              </Card>
            </Col>
          </Row>

          <h3>Detalles de Tickets</h3>
          <Table
            dataSource={ticketData}
            columns={columns}
            rowKey="id_ticket"
            pagination={{ pageSize: 5 }}
          />
        </>
      )}
    </div>
  );
}
