import Footer from "@/components/Footer";
import NavBar from "@/components/NavBar";
import { Container } from "@mui/material";

const Layout: React.FC<{
  logoVisible?: boolean;
  menuVisible?: boolean;
}> = ({ children, logoVisible = true, menuVisible = true }) => {
  return (
    <Container
      maxWidth="xl"
      sx={{
        display: "grid",
        gridTemplateRows: "min-content minmax(min-content, 1fr) min-content",
        height: "100%",
        minHeight: "100vh",
      }}
    >
      <NavBar menuVisible={menuVisible} />
      {children}
      <Footer logoVisible={logoVisible} />
    </Container>
  );
};

export default Layout;
