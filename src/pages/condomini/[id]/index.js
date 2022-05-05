import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Confirm, Button, Grid, Card } from "semantic-ui-react";
import Error from "next/error";

const Condominio = ({ condominio, error }) => {
  const [confirm, setConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { push, query } = useRouter();

  const deleteCondominio = async () => {
    const { id } = query;
    try {
      await fetch(`http://localhost:3000/api/condomini/${id}`, {
        method: "DELETE",
      });
    } catch (error) {
      console.log(error);
    }
  };

  const open = () => setConfirm(true);
  const close = () => setConfirm(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    await deleteCondominio();
    await push("/");
    close();
  };

  if (error && error.statusCode) {
    return <Error statusCode={error.statusCode} title={error.statusText} />;
  }

  return (
    <Grid
      centered
      verticalAlign="middle"
      columns="1"
      style={{ height: "80vh" }}
    >
      <Grid.Row>
        <Grid.Column textAlign="center">
          <Card centered>
            <Card.Content>
              <Card.Header>{condominio.nomeCondominio}</Card.Header>
              <Card.Description>{condominio.description}</Card.Description>
            </Card.Content>
            <Card.Content extra>
              <Button color="red" onClick={open} loading={isDeleting}>
                Elimina
              </Button>
            </Card.Content>
          </Card>
        </Grid.Column>
      </Grid.Row>
      <Confirm
        content="Sei sicuro di voler eliminare in modo DEFINITIVO il condominio selezionato?"
        header="Attesa di conferma"
        open={confirm}
        onConfirm={handleDelete}
        onCancel={close}
      />
    </Grid>
  );
};

export async function getServerSideProps({ query: { id } }) {
  const res = await fetch(`http://localhost:3000/api/condomini/${id}`);
  if (res.status === 200) {
    const condominio = await res.json();
    return {
      props: {
        condominio,
      },
    };
  }

  return {
    props: {
      error: {
        statusCode: res.status,
        statusText: "Invalid ID",
      },
    },
  };
}

export default Condominio;
