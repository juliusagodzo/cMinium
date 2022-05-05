import { useState, useEffect } from "react";
import { Button, Form, Grid, Loader } from "semantic-ui-react";
import { useRouter } from "next/router";

const CreateCondominio = () => {
  const [newCondominio, setNewCondominio] = useState({
    nomeCondominio: "",
    address: "",
    CF: "",
    description: "",
  });

  const { nomeCondominio, address, CF, description } = newCondominio;
  const { push, query } = useRouter();
  const [isSubmit, setIsSubmit] = useState(false);
  const [errors, setErrors] = useState({});

  const getCondominio = async () => {
    const response = await fetch(`http://localhost:3000/api/condomini/${query.id}`);
    const data = await response.json();
    setNewCondominio({ nomeCondominio: data.nomeCondominio, address: data.address, CF: data.CF, description: data.description });
  };

  useEffect(() => {
    if (query.id) getCondominio();
  }, [query.id]);

  const validate = () => {
    let errors = {};
    if (!nomeCondominio) {
      errors.nomeCondominio = "Il nome del condominio è richiesto";
    }
    if (!address) {
      errors.address = "L'indirizzo è richiesto";
    }
    if (!CF) {
      errors.CF = "Il codice fiscale o P.IVA sono richiesti";
    }
    if (!description) {
      errors.description = "La descrizione è richiesta";
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let errors = validate();

    if (Object.keys(errors).length) return setErrors(errors);
    setIsSubmit(true);
    if (query.id) {
      await updateCondominio();
    } else {
      await createCondominio();
    }

    await push("/");
  };

  const updateCondominio = async () => {
    try {
      await fetch(`http://localhost:3000/api/condomini/${query.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newCondominio),
      });
    } catch (error) {
      console.log(error);
    }
  };

  const createCondominio = async () => {
    try {
      await fetch(" http://localhost:3000/api/condomini", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newCondominio),
      });
    } catch (error) {
      console.log(error);
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewCondominio({ ...newCondominio, [name]: value });
  };
  return (
    <Grid
      centered
      verticalAlign="middle"
      columns="3"
      style={{ height: "80vh" }}
    >
      <Grid.Row>
        <Grid.Column textAlign="center">
          <div>
            <h1>{query.id ? "Modifica Condominio" : "Crea Condominio"}</h1>
            <div>
              {isSubmit ? (
                <Loader active inline="centered" />
              ) : (
                <Form onSubmit={handleSubmit}>
                  <Form.Input
                    error={
                      errors.nomeCondominio ? { content: "Si prega di inserire il nome del condominio" } : null
                    }
                    label="NomeCondominio"
                    placeholder="Nome Condominio"
                    name="nomeCondominio"
                    onChange={handleChange}
                    value={nomeCondominio}
                    autoFocus
                  />
                  <Form.Input
                    error={
                      errors.address ? { content: "Si prega di inserire l'indirizzo" } : null
                    }
                    label="Indirizzo (COMUNE, (PROVINCIA), Via, Numero Civico)"
                    placeholder="Inserire indirizzo"
                    name="address"
                    onChange={handleChange}
                    value={address}
                    autoFocus
                  />
                  <Form.Input
                    error={
                      errors.CF ? { content: "inserire CF o P.IVA" } : null
                    }
                    label="CF / P.IVA"
                    placeholder="Inserire CF o P.IVA"
                    name="CF"
                    onChange={handleChange}
                    value={CF}
                    autoFocus
                  />
                  <Form.TextArea
                    error={
                      errors.description
                        ? { content: "Please enter a description" }
                        : null
                    }
                    label="Descrizione (codice referente tecnico)"
                    placeholder="Inserisci la descrizione del condominio"
                    name="description"
                    onChange={handleChange}
                    value={description}
                  />
                  <Button type="submit" primary>
                    {query.id ? "Applica Modifiche" : "Aggiungi"}
                  </Button>
                </Form>
              )}
            </div>
          </div>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};

export default CreateCondominio;
