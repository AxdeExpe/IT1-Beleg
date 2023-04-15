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
                    sidebar.style.marginLeft = "-138px";

                    let handler = document.getElementById("handler");
                    handler.style.marginLeft = "16px";
                    handler.style.transform = "scaleX(-1)";
                    handler.style.backgroundColor = "gray";
                    handler.style.border = "none";

                    console.log("actSidebar(): is hidden!");
                } else {
                    this.#hidden = false;

                    let sidebar = document.getElementById("sidebar");
                    sidebar.style.marginLeft = "0px";

                    let handler = document.getElementById("handler");
                    handler.style.marginLeft = "0px";
                    handler.style.backgroundColor = "rgba(0,0,0,0.1)";

                    handler.style.removeProperty('border');
                    handler.style.removeProperty('borderColor');
                    handler.style.removeProperty('transform');
                    
                    console.log("actSidebar(): is shown!");
                }
            }
        }
    }
}