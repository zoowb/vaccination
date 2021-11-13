import "./categoryBox.css";
const CategoryBox = ({ bTitle, content }) => {
  return (
    <section className="categoryBox">
      <h1 className="bigTitle">코로나19</h1>
      <h2 className="smallTitle">COVID-19</h2>
      <h1 className="bigTitle">{bTitle}</h1>
      <span className="content">{content}</span>
      <div className="img" />
    </section>
  );
};

export default CategoryBox;
