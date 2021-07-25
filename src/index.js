import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

let img = new Image();
img.src = 'https://img.favpng.com/11/12/22/chess-piece-pin-knight-clip-art-png-favpng-saLesWdcsg2rCsJeeEeyGJqcQ.jpg';




function Square(props) {
	return (
	<button className="squarel" onClick={props.onClick}>
		{props.index}
		{props.value}
	</button>
	);
}
function Squared(props) {
	return (
	<button className="squared" background ="#fff"onClick={props.onClick}>
		{props.index}
		{props.value}
	</button>
	);
}



function isOppositeColor(compareValue,pieceColor){
	if(compareValue === 0){
		return false;
	}
	if(compareValue > 10 && pieceColor === true){
		return true;
	}else if(compareValue < 10 && pieceColor === false){
		return true;
	}else{
		return false;
	}
}

function CheckLine(x,y,xChange,yChange,color,squares){
	x += xChange;
	y += yChange;
	var cord = x + y*8;
	if(x >= 0 && x <=7){
		if(y >= 0 && y <=7){
			console.log(cord, !isOppositeColor(squares[cord],!color));
			if(!isOppositeColor(squares[cord],!color)){
				return [cord].concat(CheckLine(x,y,xChange,yChange,color,squares))
			}
		}
	}
	return null;
}

function checkForCheck(squares,){

}

function CalculateMoves(i,value,squares){


	//calculate board position of the piece
	var x = i%8;
	var y = (i-x)/8;
	var moveArray = [];

	var color = true; 	// initially assumes that the piece is white
	var direction = -1;
	if(value >= 10){	// the piece color is white
		color = false;
		direction = 1;
	}

	//pawn = 1
	//knight = 2
	//bishop = 3
	//rook = 4
	//queen = 5
	//king = 6
	if(value === 1 || value === 11){ // pawn
		//allows the pawn to take to the left if it can capture
		if(x > 0 && isOppositeColor(squares[(x-1 + (y+direction)*8)],color))
		{
			moveArray.push(x-1 + (y+direction)*8);
		}

		//allows the pawn to take to the right if there is a capture
		if(x < 7 && isOppositeColor(squares[(x+1 + (y+direction)*8)],color))
		{
			moveArray.push(x+1 + (y+direction)*8);
		}

		//allows the pawn to move one square forward
		if(squares[(x + (y+direction)*8)] === 0)
		{
			moveArray.push((x + (y+direction)*8));

			//if the pawn can move forward once check to see if it can move twice
			//if the white pawn hasn't moved yet it can move two squares
			if((value === 1 && y === 6) && squares[x + ((y-1)+direction)*8] === 0){
				moveArray.push(x + ((y-1)+direction)*8);
			//if the blackwhite pawn hasn't moved yet it can move two squares
			}else if((value === 11 && y === 1) && squares[x + ((y+1)+direction)*8] === 0){
				moveArray.push(x + ((y+1)+direction)*8);
			}
		}
	}
	if(value === 2 || value === 12){ // knight
		//temp variables
		var pHigh;
		var pLow;
		var pX;
		var pY;

		//possible combinations that will allow the special knight movement
		var PossibleX = [-2,-1,1,2];
		var PossibleY = [1,2,2,1];

		for(var index in PossibleX){
			pX = PossibleX[index];
			pY = PossibleY[index];
			pHigh = x+pX + (y+pY)*8;
			pLow = x+pX + (y-pY)*8;

			//checks to see if the x cordinate is in bounds
			if(x+pX <= 7 && x + pX >= 0){

				//checks to see if the knight could move to a square above
				if(y + pY <= 7 && !isOppositeColor(squares[pHigh],!color)){
					moveArray.push(pHigh);
				}
				//checks to see if the knight could move to a square below
				if(y - pY >= 0 && !isOppositeColor(squares[pLow],!color)){
					moveArray.push(pLow);
				}
			}
		}
	}
	if(value === 3 || value === 13){ // bishop

		moveArray = moveArray.concat(CheckLine(x,y,1,1,color,squares));
		moveArray = moveArray.concat(CheckLine(x,y,1,-1,color,squares));
		moveArray = moveArray.concat(CheckLine(x,y,-1,1,color,squares));
		moveArray = moveArray.concat(CheckLine(x,y,-1,-1,color,squares));
	}
	if(value === 4 || value == 14){	// rook
		// vertical/horizontal movement
		moveArray = moveArray.concat(CheckLine(x,y,1,0,color,squares));
		moveArray = moveArray.concat(CheckLine(x,y,-1,0,color,squares));
		moveArray = moveArray.concat(CheckLine(x,y,0,1,color,squares));
		moveArray = moveArray.concat(CheckLine(x,y,0,-1,color,squares));
	}
	if(value === 5 || value == 15){	// queen
		// diagonal movement
		moveArray = moveArray.concat(CheckLine(x,y,1,1,color,squares));
		moveArray = moveArray.concat(CheckLine(x,y,1,-1,color,squares));
		moveArray = moveArray.concat(CheckLine(x,y,-1,1,color,squares));
		moveArray = moveArray.concat(CheckLine(x,y,-1,-1,color,squares));
		// vertical/horizontal movement
		moveArray = moveArray.concat(CheckLine(x,y,1,0,color,squares));
		moveArray = moveArray.concat(CheckLine(x,y,-1,0,color,squares));
		moveArray = moveArray.concat(CheckLine(x,y,0,1,color,squares));
		moveArray = moveArray.concat(CheckLine(x,y,0,-1,color,squares));
	}
	if(value === 6){

	}
	console.log(moveArray);
	return moveArray;

} 


//The main board class
class Board extends React.Component {
	//Constructor for the Board component
	constructor(props) {
		super(props);
		this.moveArray = [];
		this.state = {
			//Initial state of the board
			squares: [14,12,13,15,16,13,12,14,11,11,11,11,11,11,11,11].concat(Array(32).fill(0).concat([1,1,1,1,1,1,1,1,4,2,3,5,6,3,2,4])),
			//initial game vars
			WhiteTurn: true,
			CordClick: true,
			clickPiece: null
		};
	}

	//Main Handler for clicks
	handleClick(i) {
		const squares = this.state.squares.slice();
		if(this.state.CordClick){
			if (squares[i] === 0) return;
			this.moveArray = CalculateMoves(i,squares[i],squares);
			this.setState({clickPiece: i});
		}else{
			console.log(i);
			for(const l in this.moveArray){
				if(i === this.moveArray[l]){
					console.log("moved");
					squares[i] = squares[this.state.clickPiece];
					squares[this.state.clickPiece] = 0;
				}
			}
		}

		this.setState({
			squares: squares,
			WhiteTurn: !this.state.WhiteTurn,
			CordClick: !this.state.CordClick,

		});
	}

	renderPiece(i){
		//pawn = 1
		//knight = 2
		//bishop = 3
		//rook = 4
		//queen = 5
		//king = 6

		switch(this.state.squares[i]){
			case(1):
				return "Wp";
			case(2):
				return "Wk";
			case(3):
				return "Wb";
			case(4):
				return "Wr";
			case(5):
				return "Wq";
			case(6):
				return "Wx";
			case(11):
				return "Bp";
			case(12):
				return "Bk";
			case(13):
				return "Bb";
			case(14):
				return "Br";
			case(15):
				return "Bq";
			case(16):
				return "Bx";
			default:
				return;
		}
	}

	//Render a light square
	//displayes the corresponding piece
	renderSquare(i) {
		return (
			<Square
			value={this.renderPiece(i)}
			index={i} 
			onClick={() => this.handleClick(i)}
			/>
		);
	}
	renderSquared(i){
		return (
			<Squared
			value={this.renderPiece(i)}
			index={i} 
			onClick={() => this.handleClick(i)}
			/>
		);

	}



	render() {
		//Status strings that are displayed above the board
		let status = 'To Move: ' + (this.state.WhiteTurn ? 'White' : 'Black');
		let instruction = 'Instruction: ' + (this.state.CordClick ? 'Choose a Piece' : 'Move the Piece');
		//renderSquare(i) renders a light square
		//renderSquared(i) renders a dard square
		return (
			<div>
				<div className="status">{status}</div>
				<div className="instruction">{instruction}</div>
				<div className="board-row">
					{this.renderSquare(0)}
					{this.renderSquared(1)}
					{this.renderSquare(2)}
					{this.renderSquared(3)}
					{this.renderSquare(4)}
					{this.renderSquared(5)}
					{this.renderSquare(6)}
					{this.renderSquared(7)}
				</div>
				<div className="board-row">
					{this.renderSquared(0+8)}
					{this.renderSquare(1+8)}
					{this.renderSquared(2+8)}
					{this.renderSquare(3+8)}
					{this.renderSquared(4+8)}
					{this.renderSquare(5+8)}
					{this.renderSquared(6+8)}
					{this.renderSquare(7+8)}
				</div>
				<div className="board-row">
					{this.renderSquare(0+16)}
					{this.renderSquared(1+16)}
					{this.renderSquare(2+16)}
					{this.renderSquared(3+16)}
					{this.renderSquare(4+16)}
					{this.renderSquared(5+16)}
					{this.renderSquare(6+16)}
					{this.renderSquared(7+16)}
				</div>
				<div className="board-row">
					{this.renderSquared(0+24)}
					{this.renderSquare(1+24)}
					{this.renderSquared(2+24)}
					{this.renderSquare(3+24)}
					{this.renderSquared(4+24)}
					{this.renderSquare(5+24)}
					{this.renderSquared(6+24)}
					{this.renderSquare(7+24)}
				</div>
				<div className="board-row">
					{this.renderSquare(0+32)}
					{this.renderSquared(1+32)}
					{this.renderSquare(2+32)}
					{this.renderSquared(3+32)}
					{this.renderSquare(4+32)}
					{this.renderSquared(5+32)}
					{this.renderSquare(6+32)}
					{this.renderSquared(7+32)}
				</div>
				<div className="board-row">
					{this.renderSquared(0+40)}
					{this.renderSquare(1+40)}
					{this.renderSquared(2+40)}
					{this.renderSquare(3+40)}
					{this.renderSquared(4+40)}
					{this.renderSquare(5+40)}
					{this.renderSquared(6+40)}
					{this.renderSquare(7+40)}
				</div>
				<div className="board-row">
					{this.renderSquare(0+48)}
					{this.renderSquared(1+48)}
					{this.renderSquare(2+48)}
					{this.renderSquared(3+48)}
					{this.renderSquare(4+48)}
					{this.renderSquared(5+48)}
					{this.renderSquare(6+48)}
					{this.renderSquared(7+48)}
				</div>
				<div className="board-row">
					{this.renderSquared(0+56)}
					{this.renderSquare(1+56)}
					{this.renderSquared(2+56)}
					{this.renderSquare(3+56)}
					{this.renderSquared(4+56)}
					{this.renderSquare(5+56)}
					{this.renderSquared(6+56)}
					{this.renderSquare(7+56)}
				</div>
			</div>
		);
	}
}

class Game extends React.Component {
	render() {
	return (
		<div className="game">
		<div className="game-board">
			<Board />
		</div>
		<div className="game-info">
			<div>{/* status */}</div>
			<ol>{/* TODO */}</ol>
		</div>
		</div>
	);
	}
}

// ========================================

ReactDOM.render(
	<Game />,
	document.getElementById('root')
);
