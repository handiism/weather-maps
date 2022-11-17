import "../styles/Form.css";

const Form = () => {
  return (
    <div className="Form">
      <input
        className="Input"
        type="text"
        name="city"
        placeholder="Search Place"
      />
      <button className="Button">Get Weather</button>
    </div>
  );
};

export default Form;
