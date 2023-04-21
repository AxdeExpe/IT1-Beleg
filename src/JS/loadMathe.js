"use strict"

export default async function loadMathe(){
    const response = await fetch("../JSON/Mathe.json");
    const data = await response.json();
    return data;
}