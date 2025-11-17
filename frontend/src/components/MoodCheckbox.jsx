import React from "react";

function MoodSelector({label,name,value,options,onChange})
{
    return(
        <fieldset>
            <legend>{label}</legend>
            {options.map ((opt,index) => (
            <label key={index}>
                <input type="checkbox"
                name = {name}
                value={opt} 
                onChange={onChange}
                checked = {value.includes(opt)}
                />
                {opt}:
            </label>

            ))}
        </fieldset>

    );
}

export default MoodSelector;
