import React from "react";



function ListCard({items}){
    return (
        <div className="card-list">
            {items.map( (item,index) => (
                <div className="card" key={index}>
                    <h3>{item.title}</h3>
                    <p>Category: {item.category}</p>
                    <p>Mood: {item.mood.join(", ")}</p>
                    <p>Recommender: {item.recommender}</p>
                </div>
            )

            )}
        </div>
    );

}

export default ListCard