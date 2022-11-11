import { computeNinjaseRectangle } from "../boundary/Boundary";
import { move } from "../model/Model";
import { Coordinate } from "../model/Model.js";
import { Model } from "../model/Model.js";


// export function selectPiece(model,canvas,event){
//     // const canvasReact = canvas.getBoundingClientRect();

//     // //find configuration on which mouse was clicked
//     // let idx = model.configuration.ninjase.findIndex(ninjase => {
//     //     let rect = computeNinjaseRectangle(ninjase);
//     //     return rect.contains(event.clientX - canvasReact.left, event.clientY - canvasReact.top);
//     // })

//     //WAIT FOR MOVE PIECE TO IMPLEMENT

//     // return model.copy();
// }



export function moveNinjase(model,direction){
    let selected = model.configuration.ninjase;


    // console.log(model.configuration.ninjase[0]);
    

    selected[0].move(direction)

    if(model.configuration.isCoveredDoor(selected[0].location())){
        let coord = new Coordinate(selected[0].row,selected[0].column)
        console.log(coord)
        
        model.configuration.deleteDoor(coord);
    }




    model.updateMoveCount(+1);

    return model.copy(); 
}



export function pickUpKey(model){
    let selected = model.configuration;
    selected.keyPickUp();

    return model.copy();
}


export function reset(model){
    return model.copy();
}