import Head from "next/head";
import { NavbarCondomini } from "./NavbarCondomini";

export const Layout = ({ children }) => (
    <>
        <Head>
            <title>cMinium</title>
        </Head>
        <NavbarCondomini />
        {children}
    </>
);
