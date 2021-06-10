import React from "react";

let capitalizeFirstLetter = (string) =>  string.charAt(0).toUpperCase() + string.slice(1)

export function DisplayElement({element}){
    let otherkeys = Object.keys(element).filter(key => key!="name" && key!="url" && key != "id")
    let othervalues = otherkeys.map(key => element[key])
    let otherpairs = otherkeys.map((key,i) => ({key: capitalizeFirstLetter(key), value: othervalues[i]}))
        
    return(
        <div>
            <a href={element.url} target="_blank">
                <h2>{`${element.name}`}</h2>
            </a>
            {otherpairs.map(pair => <p key={pair.value}>{`${pair.key}: ${pair.value}`}</p>)}
        </div>
    )
}