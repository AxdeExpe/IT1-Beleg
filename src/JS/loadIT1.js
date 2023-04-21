"use strict"

export default async function loadIT1(){
    const response = await fetch("../JSON/IT 1.json");
    const data = await response.json();
    return data;
}