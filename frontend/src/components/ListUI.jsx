import React from "react";
import css ... 



function ListCard({items}){
    return (
        <div className="card-list">
            {items.map( (item,index) => (
                <div className="card" key={index}>
                    <h3 className="item-title">{item.item_name}</h3>
                    <p>Category: {item.category}</p>
                    <p>Mood: {item.moods.map(m=>m.name).join(", ")}</p>
                    <p>Recommender: {item.recommender}</p>
                </div>
            )

            )}
        </div>
    );

}

export default ListCard