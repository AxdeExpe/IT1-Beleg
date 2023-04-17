"use strict"
document.addEventListener('DOMContentLoaded', function (){
    let m, p, v;
    m = new Model();
    p = new Presenter();
    v = new View(p);
    p.setModelAndView(m,v);
    p.start();
})

//---------------------Model--------------------------------------------------------------------
class Model{

    getTask(){
        return "1";
    }

}

//---------------------Presenter----------------------------------------------------------------
class Presenter{
    #v;
    #m;
    setModelAndView(m, v){
        this.#m = m;
        this.#v = v;
    }

    start(){
        //let a = this.#m.getTask();
        //document.getElementById("handler");
    }

}

//---------------------View---------------------------------------------------------------------
class View {
    #p;
    #hidden;

    constructor(p) {
        this.#p = p;
        this.#hidden = false;
        this.setHandler();
    }

    setHandler() {
        document.getElementById("sidebar").addEventListener("click", this.actSidebar.bind(this));
        document.getElementById("Mathe").addEventListener("click", this.);
        document.getElementById("Allgemeines").addEventListener("click", this.);
        document.getElementById("IT").addEventListener("click", this.);

        //document.getElementById("sidebar").addEventListener("click", this.showSidebar.bind(this));
        //document.querySelector("#sidebar > *").setAttribute("number", 0);
    }

    evaluate(event) {

    }

    actSidebar(event) {
        if (event.target.nodeName.toLowerCase() === "button") {

            if (event.target.id === "handler") {

                if (this.#hidden === false) {
                    this.#hidden = true;

                    let sidebar = document.getElementById("sidebar");
                    sidebar.style.marginLeft = "-30vw";

                    let handler = document.getElementById("handler");
                    handler.style.marginLeft = "0px";
                    handler.style.transform = "scaleX(-1)";
                    handler.style.borderRadius = "5px 0px 0px 5px";
                    handler.style.backgroundColor = "gray";
                    handler.style.border = "none";

                    console.log("actSidebar(): is hidden!");
                } else {
                    this.#hidden = false;

                    let sidebar = document.getElementById("sidebar");
                    sidebar.style.marginLeft = "0px";

                    let handler = document.getElementById("handler");
                    handler.style.marginLeft = "null";
                    handler.style.backgroundColor = "gray";
                    handler.style.borderRadius = "0px 5px 5px 0px";
                    handler.style.removeProperty('borderColor');
                    handler.style.removeProperty('transform');
                    
                    console.log("actSidebar(): is shown!");
                }
            }
        }
    }
}