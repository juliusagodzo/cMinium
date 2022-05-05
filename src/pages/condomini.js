import { Button, Card, Container, Grid } from "semantic-ui-react";
import Link from "next/link";
import { useRouter } from "next/router";
import Head from "next/head";
import { NavbarCondomini } from "../components/NavbarCondomini";

export default function Home({ condomini = [] }) {
    const router = useRouter();

    if (condomini.length === 0) {
        return (
            <Grid
                centered
                verticalAlign="middle"
                columns="1"
                style={{ height: "80vh" }}
            >
                <Grid.Row>
                    <Grid.Column textAlign="center">
                        <h1>Benvenuto amministatore. Per iniziare, crea un nuovo condominio</h1>
                        <div>
                            <Button primary onClick={() => router.push("/condomini/new")}>
                                Crea condominio
                            </Button>
                        </div>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        );
    }
    return (
        <Container>
            <NavbarCondomini />
            <Card.Group itemsPerRow={1}>
                {condomini &&
                    condomini.map((condomini) => (
                        <Card key={condomini._id}>
                            <Card.Content>
                                <Card.Header>
                                    <Link href={`/condomini/${condomini._id}`}>
                                        <a>{condomini.nomeCondominio}</a>
                                    </Link>
                                </Card.Header>
                                <p>{condomini.description}</p>
                            </Card.Content>
                            <Card.Content extra>
                                <Button
                                    color="orange"
                                    onClick={() => router.push(`/condomini/${condomini._id}`)}
                                >
                                    Visualizza
                                </Button>
                                <Button
                                    color="blue"
                                    onClick={() => router.push(`/condomini/${condomini._id}/edit`)}
                                >
                                    Modifica
                                </Button>
                            </Card.Content>
                        </Card>
                    ))}
            </Card.Group>
        </Container>
    );
}

export async function getServerSideProps() {
    const response = await fetch(" http://localhost:3000/api/condomini");
    const condomini = await response.json();

    return {
        props: {
            condomini,
        },
    };
}