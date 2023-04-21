"use strict"

export default async function loadAllgemeines(){
    const response = await fetch("../JSON/Allgemeines.json");
    const data = await response.json();
    return data;
}