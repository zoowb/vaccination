import "./wholeScreen.css";
import Header from "./header/header";
const WholeScreen = ({ children }) => {
  return <section className="wholeScreen">{children}</section>;
};

const WholeScreenWithHeader = ({ children }) => {
  return (
    <section className="wholeScreen">
      <Header />
      {children}
    </section>
  );
};

export { WholeScreenWithHeader };
export default WholeScreen;
