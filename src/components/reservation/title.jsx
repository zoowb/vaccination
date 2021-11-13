import "./title.css";
const Title = ({ title, subtitle }) => {
  return (
    <section className="titleSection">
      <h1 className="title">{title}</h1>
      <span className="subtitle">{subtitle}</span>
    </section>
  );
};
export default Title;
