import React from "react";



function ListCard({items}){

    // for new user without recommendation
    if (!items || items.length ===0)
    {
        return(
            <div>
                <h3>No Recommendations saved yet.</h3>
                <p>Start by adding your first recommendation!</p>
            </div>
        );
    }
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