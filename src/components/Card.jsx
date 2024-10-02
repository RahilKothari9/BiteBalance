import React from 'react';

const Card = ({ title, description, inglist, inslist }) => {

  return (
    <div className="card">
      <h2>{title}</h2>
      <p>{description}</p>
      <ul>
        {Array.isArray(inglist) && inglist.map((innerArray, index) => (
          
          <li key={index}>{innerArray.name} - {innerArray.amount}</li>
        ))}
      </ul>
      <ol>
        {Array.isArray(inslist) && inslist.map((instruction, index) => (
          <li key={index}>Step {instruction.step} - {instruction.description}</li>
        ))}
      </ol>
    </div>
  );
};

export default Card;
