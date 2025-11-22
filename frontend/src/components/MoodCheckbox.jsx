import React from "react";

function MoodSelector({label,name,value,options,onChange})
{
    return(
        <fieldset>
            <legend className="mood-label">{label}</legend>
            {options.map ((opt) => (
            <div className="mood-item" key ={opt.id}>  
            <label htmlFor={`opt-${opt.id}`}>{opt.label}: </label>
                <input type="checkbox"
                id ={`opt-${opt.id}`}
                name = {name}
                value={opt.id} 
                onChange={onChange}
                checked = {value.includes(opt.id)}
                ></input>
            </div>
            

            ))}
        </fieldset>

    );
}

export default MoodSelector;
