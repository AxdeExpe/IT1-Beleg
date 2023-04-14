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
class View{
    #p;
    #hidden;
    constructor(p){
       this.#p=p;
       this.setHandler();
    }

    setHandler(){
        document.getElementById("sidebar").addEventListener("click", this.hideSidebar.bind(this));
        document.getElementById("sidebar").addEventListener("click", this.showSidebar.bind(this));
        this.#hidden = false;
        //document.querySelector("#sidebar > *").setAttribute("number", 0);
    }

    evaluate(event){

    }

    showSidebar(){

    }
    
    hideSidebar(event){
        
        if(this.#hidden === false) {

            if (event.target.nodeName.toLowerCase() === "button") {
                this.#hidden = true;

                if (event.target.id === "handler") {
                    let sidebar = document.getElementById("sidebar");
                    sidebar.style.marginLeft = "-138px";

                    let handler = document.getElementById("handler");
                    handler.style.marginLeft = "16px";
                    handler.style.transform = "scaleX(-1)";
                    handler.style.backgroundColor = "gray";
                    handler.style.border = "none";

                    console.log("hideHandler(): " + event.type + " Color: " + this.color);
                }
            }
        }
    }
    
    showSidebar(event){
        
        if(this.#hidden === true){
            let sidebar = document.getElementById("sidebar");
            sidebar.style.marginLeft = "138px";
            
            console.log("hallo");

        }
    }
}