import React from "react";

function MoodSelector({label,name,value,options,onChange})
{
    return(
        <fieldset>
            <legend className="mood-label">{label}</legend>
            {options.map ((opt,index) => (
            <div className="mood-item" key ={index}>  
            <label htmlFor="mood">{opt}: </label>
                <input type="checkbox"
                id ="mood"
                name = {name}
                value={opt} 
                onChange={onChange}
                checked = {value.includes(opt)}
                ></input>
            </div>
            

            ))}
        </fieldset>

    );
}

export default MoodSelector;
