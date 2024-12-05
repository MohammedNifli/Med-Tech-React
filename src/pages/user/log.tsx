import React from "react";

const Login: React.FC<{ name: string; lastName: string }> = ({ name, lastName }) => {
    let arr=["Mohammed","Mohammed Nifli", "Mohammed Nifli ap"];
    let nameList= arr.map(name => <h2>{name}</h2>)
    return (
      <div>{nameList}</div>
    );
  };

export default Login;
