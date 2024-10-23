import React from 'react';

const Card = ({ title, description, inglist, inslist }) => {

  return (
    <div className="card min-w-full ">
      <h2>{title}</h2>
      <p>{description}</p>
      <ul className=' w-full'>
        {Array.isArray(inglist) && inglist.map((innerArray, index) => (
          
          <li className=' w-full ' key={index}>{innerArray.name} - {innerArray.amount}</li>
        ))}
      </ul>
      <ol className='w-full '>
        {Array.isArray(inslist) && inslist.map((instruction, index) => (
          <li className='w-full mb-2'  key={index}>
            <span className=' font-bold'>Step {instruction.step} </span>
            - {instruction.description}
           
            </li>
        ))}
      </ol>
    </div>
  );
};

export default Card;
