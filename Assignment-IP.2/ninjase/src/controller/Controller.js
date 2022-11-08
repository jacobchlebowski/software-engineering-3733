import { computeNinjaseRectangle } from "../boundary/Boundary";
import { move } from "../model/Model";


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
    selected.move(direction)

    model.updateMoveCount(+1);
    return model.copy(); 
}