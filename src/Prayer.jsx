//import React from 'react'

export default function Prayers({ name, time, image}) {
    return (
      <div className="card" style={{ marginLeft:"10px", width:"250px", height:"350px"}}> 
              <div id="img">
              <img src={image} alt="" />
              </div>
             <h2>{name}</h2>
             <h2>{time}</h2>
          </div>
    )
  }
  

  