import { useState, useEffect } from "react";
import axios from "axios";
import { Row, Col, Card, Typography, Table, Spin } from "antd";
import { Bar } from '@ant-design/charts';

const { Title } = Typography;

const Dashboard = () => {
  const [stats, setStats] = useState({
    total: 0,
    abiertos: 0,
    enProgreso: 0,
    cerrados: 0,
  });
  const [ticketsByDate, setTicketsByDate] = useState([]);
  const [openTickets, setOpenTickets] = useState([]);
  const [userTicketStats, setUserTicketStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/tickets");
        const tickets = response.data;

        if (!Array.isArray(tickets)) {
          console.error("Los datos de tickets no son un array. Verifica la API.");
          return;
        }

        // Estadísticas generales
        const abiertos = tickets.filter((t) => t.estado?.toLowerCase() === "abierto");
        const enProgreso = tickets.filter((t) => t.estado?.toLowerCase() === "en progreso").length;
        const cerrados = tickets.filter((t) => t.estado?.toLowerCase() === "cerrado").length;

        setStats({
          total: tickets.length,
          abiertos: abiertos.length,
          enProgreso,
          cerrados,
        });

        // Tickets por fecha de creación
        const ticketsByDate = tickets.reduce((acc, ticket) => {
          const fecha = new Date(ticket.fecha_creacion).toLocaleDateString(); // Formatear fecha
          acc[fecha] = (acc[fecha] || 0) + 1;
          return acc;
        }, {});

        const formattedData = Object.entries(ticketsByDate).map(([date, count]) => ({
          date,
          count,
        }));

        setTicketsByDate(formattedData);

        // Solo los primeros 7 tickets abiertos
        const ticketsAbiertos = abiertos.map((ticket) => ({
          id: ticket.id,
          descripcion: ticket.descripcion?.slice(0, 70) + "...", // Descripción abreviada
        }));
        setOpenTickets(ticketsAbiertos.slice(0, 7));

        setLoading(false);
      } catch (error) {
        console.error("Error al obtener datos de tickets:", error);
        setLoading(false);
      }
    };

    const fetchUserTicketStats = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/users/tickets-abiertos");
        setUserTicketStats(response.data);
      } catch (error) {
        console.error("Error al obtener datos de usuarios y tickets:", error);
      }
    };

    fetchData();
    fetchUserTicketStats();
  }, []);

  const openTicketsColumns = [
    // { title: "ID", dataIndex: "id", key: "id" },
    { title: "Descripción", dataIndex: "descripcion", key: "descripcion" },
  ];

  const userTicketStatsColumns = [
    { title: "Usuario", dataIndex: "usuario", key: "usuario" },
    { title: "Tickets Abiertos", dataIndex: "ticketsAbiertos", key: "ticketsAbiertos" },
  ];

  // Configuración del gráfico de Barras (nuevo estilo)
  const barConfig = {
    data: ticketsByDate,
    xField: 'count',
    yField: 'date',
    seriesField: 'date',
    colorField: 'date',
    color: '#1890ff',
    legend: false,
    label: {
      position: 'middle',
      style: { fill: '#fff' },
    },
    meta: {
      count: {
        alias: 'Tickets',
      },
      date: {
        alias: 'Fecha',
      },
    },
  };

  return (
    <div style={{ padding: "20px" }}>
      <Title level={2}>Menú Principal</Title>
      {loading ? (
        <Spin size="large" />
      ) : (
        <>
          <Row gutter={16}>
            <Col span={6}>
              <Card>
                <Title level={4}>Total Tickets</Title>
                <Title level={3} style={{ color: "blue" }}>
                  {stats.total}
                </Title>
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Title level={4}>Tickets Abiertos</Title>
                <Title level={3} style={{ color: "green" }}>
                  {stats.abiertos}
                </Title>
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Title level={4}>Tickets en Progreso</Title>
                <Title level={3} style={{ color: "orange" }}>
                  {stats.enProgreso}
                </Title>
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Title level={4}>Tickets Cerrados</Title>
                <Title level={3} style={{ color: "red" }}>
                  {stats.cerrados}
                </Title>
              </Card>
            </Col>
          </Row>

          <Row gutter={16} style={{ marginTop: "40px" }}>
            <Col span={16}>
              <Card title="Tickets por Fecha" bordered={false}>
                <Bar {...barConfig} />
              </Card>
            </Col>

            <Col span={8}>
              <Title level={4}>Tickets Abiertos</Title>
              <Table
                columns={openTicketsColumns}
                dataSource={openTickets}
                rowKey="id"
                pagination={false}
                size="small"
              />
            </Col>
          </Row>

          <div style={{ marginTop: "40px" }}>
            <Title level={4}>Tickets Abiertos por Usuario</Title>
            <Table
              columns={userTicketStatsColumns}
              dataSource={userTicketStats}
              rowKey="usuario"
              pagination={false}
              size="small"
            />
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
