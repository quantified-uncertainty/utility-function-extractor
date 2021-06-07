import React from "react";

export function DisplayElement({element}){
    return(
        <div>
            <a href={element.url} target="_blank">
                <h1>{`${element.name}`}</h1>
            </a>
            <p>{`Author: ${element.author}`}</p>
            <p>{`Karma: ${element.karma}`}</p>
           
        </div>
    )
}