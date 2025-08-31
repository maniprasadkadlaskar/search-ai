import { Col, Container, Image, Row } from "react-bootstrap";


const Home = () => {
    return (
        <Container
            fluid
            style={{
                width: "300px",
            }}
        >
            <Row>
                <Col xs={"auto"}>
                    <Image src="assets/icon-128.png" width={"30px"} height={"30px"} />
                </Col>
                <Col xs={"auto"}>
                    Search AI
                </Col>
            </Row>
        </Container>
    );
}

export default Home;