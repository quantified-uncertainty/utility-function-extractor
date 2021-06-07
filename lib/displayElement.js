import React from "react";

export function DisplayElement({element}){
    return(
        <div>
            <a href={element.url} target="_blank">
                <h1>{`${element.name}`}</h1>
                <p>{`Karma: ${1}`}</p>
            </a>
        </div>
    )
}