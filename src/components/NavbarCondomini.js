import { Menu, Container, Button } from "semantic-ui-react";
import Link from "next/link";
import { useRouter } from "next/router";

export const NavbarCondomini = () => {
    const router = useRouter();
    return (
        <Menu
            inverted
            borderless
            style={{ padding: ".3rem", marginBottom: "20px" }}
            attached
        >
            <Container>
                <Menu.Item position="left">
                    <Button
                        size="mini"
                        primary
                        onClick={() => router.push("/")}
                    >
                        Pannello gestione utenti
                    </Button>
                </Menu.Item>
                <Menu.Menu position="right">
                    <Menu.Item>
                        <Button
                            size="mini"
                            primary
                            onClick={() => router.push("/condomini/new")}
                        >
                            Aggiungi condominio
                        </Button>
                    </Menu.Item>
                </Menu.Menu>
            </Container>
        </Menu>
    );
};
