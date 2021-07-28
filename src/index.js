import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

let img = new Image();
img.src = 'https://img.favpng.com/11/12/22/chess-piece-pin-knight-clip-art-png-favpng-saLesWdcsg2rCsJeeEeyGJqcQ.jpg';


/*
	This function removes dublicates from an array
	Thank you to LiraNuna on stackoverflow for this code block
	https://stackoverflow.com/a/1584377
*/
function arrayUnique(array) {
    var a = array.concat();
    for(var i=0; i<a.length; ++i) {
        for(var j=i+1; j<a.length; ++j) {
            if(a[i] === a[j])
                a.splice(j--, 1);
        }
    }

    return a;
}

//function to display the light square
function Square(props) {
	return (
	<button className="squarel" onClick={props.onClick}>
		{props.index}
		{props.value}
	</button>
	);
}
//function to display the dark square
function Squared(props) {
	return (
	<button className="squared" background ="#fff"onClick={props.onClick}>
		{props.index}
		{props.value}
	</button>
	);
}


// checks to see if compareValue is a different color to pieceColor
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

/*
	CheckLine(int, int, int, int, bool, int[][])
	Recursively collects a list of possible moves in a line directed by xChange and yChange
	returns a set of possible moves in a streight line
*/
function CheckLine(x,y,xChange,yChange,color,squares){
	x += xChange;
	y += yChange;
	var cord = x + y*8;
	if(x >= 0 && x <=7){
		if(y >= 0 && y <=7){
			if(squares[cord] === 0){
				if(CheckLine(x,y,xChange,yChange,color,squares) === null){
					return [cord]
				}
				return [cord].concat(CheckLine(x,y,xChange,yChange,color,squares))
			}else{
				if(isOppositeColor(squares[cord],color)){
					return [cord]
				}
			}
		}
	}
	return -1;
}

function CalculateCheck(squares, attacks, color){
	for(var i in attacks){
		
		if(squares[attacks[i]] === 6 && color){			// if the selected color is white and the white king is attacked
			return true; 
		}else if(squares[attacks[i]] === 16 && !color){ // if the selected color is black and the black king is attacked
			return true;
		}	
	}
	return false;
}

function CalculatePawnMoves(x,y,color,i,value,squares){

	var moveArray = [];

	var direction = -1;	// assumes the color is white
	if(value >= 10){	// the piece color is black invert it
		direction = 1;
	}

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

	return moveArray;
}
function CalculatePawnAttacks(x,y,value){
	var moveArray = [];

	if(value === 1){
		if(x-1 >= 0 && y+1 <= 7){
			moveArray.push((x-1)+(y-1)*8);
		}
		if(x+1 <= 7 && y+1 <= 7){
			moveArray.push((x+1)+(y-1)*8);
		}
	}else{
		if(x-1 >= 0 && y-1 >= 0){
			moveArray.push((x-1)+(y+1)*8);
		}
		if(x+1 <= 7 && y-1 >= 0){
			moveArray.push((x+1)+(y+1)*8);
		}
	}
	return moveArray;
}
function CalculateKnightMoves(x,y,color,squares){
	var pX;
	var pY;

	var moveArray = [];

	//temp variables
	var pHigh;
	var pLow;
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
	return moveArray;
}
function CalculateKnightAttacks(x,y,color,squares){
	var pX;
	var pY;

	var moveArray = [];

	//temp variables
	var pHigh;
	var pLow;
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
			if(y + pY <= 7 ){
				moveArray.push(pHigh);
			}
			//checks to see if the knight could move to a square below
			if(y - pY >= 0 ){
				moveArray.push(pLow);
			}
		}
	}
	return moveArray;
}
function CalculateBishopMoves(x,y,color,squares){
	var moveArray = [];

	moveArray = moveArray.concat(CheckLine(x,y,1,1,color,squares));
	moveArray = moveArray.concat(CheckLine(x,y,1,-1,color,squares));
	moveArray = moveArray.concat(CheckLine(x,y,-1,1,color,squares));
	moveArray = moveArray.concat(CheckLine(x,y,-1,-1,color,squares));

	return moveArray;
}
function CalculateBishopAttacks(x,y,color,squares){
	var moveArray = [];

	moveArray = moveArray.concat(CheckLine(x,y,1,1,color,squares));
	moveArray = moveArray.concat(CheckLine(x,y,1,-1,color,squares));
	moveArray = moveArray.concat(CheckLine(x,y,-1,1,color,squares));
	moveArray = moveArray.concat(CheckLine(x,y,-1,-1,color,squares));

	// Acts like opposite color to show that it defends pieces of the same color
	moveArray = moveArray.concat(CheckLine(x,y,1,1,!color,squares));
	moveArray = moveArray.concat(CheckLine(x,y,1,-1,!color,squares));
	moveArray = moveArray.concat(CheckLine(x,y,-1,1,!color,squares));
	moveArray = moveArray.concat(CheckLine(x,y,-1,-1,!color,squares));

	return arrayUnique(moveArray);
}
function CalculateRookMoves(x,y,color,squares){
	var moveArray = [];

	// vertical/horizontal movement
	moveArray = moveArray.concat(CheckLine(x,y,1,0,color,squares));
	moveArray = moveArray.concat(CheckLine(x,y,-1,0,color,squares));
	moveArray = moveArray.concat(CheckLine(x,y,0,1,color,squares));
	moveArray = moveArray.concat(CheckLine(x,y,0,-1,color,squares));

	return moveArray;
}
function CalculateRookAttacks(x,y,color,squares){
	var moveArray = [];

	// vertical/horizontal movement (acts like normal)
	moveArray = moveArray.concat(CheckLine(x,y,1,0,color,squares));
	moveArray = moveArray.concat(CheckLine(x,y,-1,0,color,squares));
	moveArray = moveArray.concat(CheckLine(x,y,0,1,color,squares));
	moveArray = moveArray.concat(CheckLine(x,y,0,-1,color,squares));

	// Acts like opposite color to show that it defends pieces of the same color
	moveArray = moveArray.concat(CheckLine(x,y,1,0,!color,squares));
	moveArray = moveArray.concat(CheckLine(x,y,-1,0,!color,squares));
	moveArray = moveArray.concat(CheckLine(x,y,0,1,!color,squares));
	moveArray = moveArray.concat(CheckLine(x,y,0,-1,!color,squares));

	return arrayUnique(moveArray);
}
function CalculateQueenMoves(x,y,color,squares){
	var moveArray = [];

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

	return moveArray;
}
function CalculateQueenAttacks(x,y,color,squares){
	var moveArray = [];

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


	// Acts like opposite color to show that it defends pieces of the same color
	// diagonal movement
	moveArray = moveArray.concat(CheckLine(x,y,1,1,!color,squares));
	moveArray = moveArray.concat(CheckLine(x,y,1,-1,!color,squares));
	moveArray = moveArray.concat(CheckLine(x,y,-1,1,!color,squares));
	moveArray = moveArray.concat(CheckLine(x,y,-1,-1,!color,squares));
	// vertical/horizontal movement
	moveArray = moveArray.concat(CheckLine(x,y,1,0,!color,squares));
	moveArray = moveArray.concat(CheckLine(x,y,-1,0,!color,squares));
	moveArray = moveArray.concat(CheckLine(x,y,0,1,!color,squares));
	moveArray = moveArray.concat(CheckLine(x,y,0,-1,!color,squares));
	return arrayUnique(moveArray);
}
function CalculateKingAttacks(x,y){
	var pX;
	var pY;
	var moveArray = [];
	for(var tempX in [-1,0,1]){
		for(var tempY in [-1,0,1]){
			pX = [-1,0,1][tempX];
			pY = [-1,0,1][tempY];
			if( (x+pX <= 7 && x+pX >= 0) && (y+pY <= 7 && y+pY >= 0)){
				moveArray.push(x+pX + ((y+pY)*8));
			}
		}
	}
	return moveArray;
}
function CalculateKingMoves(x,y,color,squares){
	var pX;
	var pY;

	var moveArray = [];
	var combinedX;
	var combinedY;
	var tempI;

	var validMove;
	var allOpponentMoves = CalculateAllAttacksForOppositeColor(squares,color);

	for(var tempX in [-1,0,1]){
		for(var tempY in [-1,0,1]){

			pX = [-1,0,1][tempX];
			pY = [-1,0,1][tempY];

			combinedX = x + pX;
			combinedY = y + pY;

			tempI = combinedX + ((combinedY)*8);
			//checks to see if the potential posistion is within the bounds of the board
			if( (combinedX <= 7 && combinedX >= 0) && (combinedY <= 7 && combinedY >= 0) ){
				//checks to see if the potential position is not where the king is already 
				if(pX !==0 || pY !==0){


					validMove = true;
					for(var m in allOpponentMoves){
						if(allOpponentMoves[m] === tempI){
							validMove = false;
						}
					}

					if(validMove === true && !isOppositeColor(squares[tempI],!color)){
						moveArray.push(tempI);
					}
				}
			}

		}
	}
	console.log(moveArray);
	return moveArray;
}
/*
	CalculateAllAttacksForOppositeColor (int[], bool)
	returns all of the attacked squares on the board from the opposing color
*/
function CalculateAllAttacksForOppositeColor(squares,CheckColor){
	//calculate board position of the piece
	var x;
	var y;

	var allAttacks = [];
	var color;
	var value;

	for(var i in squares){
		x = i%8;
		y = (i-x)/8;

		value = squares[i];
		color = true; 	// initially assumes that the piece is white
		if(value >= 10){	// the piece color is white
			color = false;
		}

		if(CheckColor){
					
			if(value === 11){ // pawn
				allAttacks = allAttacks.concat(CalculatePawnAttacks(x,y,value));
			}
			else if(value === 12){ // knight
				allAttacks = allAttacks.concat(CalculateKnightAttacks(x,y,color,i,value,squares));
			}
			else if(value === 13){ // bishop
				allAttacks = allAttacks.concat(CalculateBishopAttacks(x,y,color,squares));
			}
			else if(value === 14){ // rook
				allAttacks = allAttacks.concat(CalculateRookAttacks(x,y,color,squares));
			}
			else if(value === 15){ // queen
				allAttacks = allAttacks.concat(CalculateQueenAttacks(x,y,color,squares));
			}
			else if(value === 16){
				allAttacks = allAttacks.concat(CalculateKingAttacks(x,y));
			}
		}else{
			if(value === 1){ // pawn
				allAttacks = allAttacks.concat(CalculatePawnAttacks(x,y,value));
			}
			else if(value === 2){ // knight
				allAttacks = allAttacks.concat(CalculateKnightAttacks(x,y,color,i,value,squares));
			}
			else if(value === 3){ // bishop
				allAttacks = allAttacks.concat(CalculateBishopAttacks(x,y,color,squares));
			}
			else if(value === 4){ // rook
				allAttacks = allAttacks.concat(CalculateRookAttacks(x,y,color,squares));
			}
			else if(value === 5){ // queen
				allAttacks = allAttacks.concat(CalculateQueenAttacks(x,y,color,squares));
			}
			else if(value === 6){
				allAttacks = allAttacks.concat(CalculateKingAttacks(x,y));
			}
		}
	}
	//array unique here removes the excess null values and cleans up the output for easier debug
	return arrayUnique(allAttacks).sort();
}

/*
	CalculateMoves(int, int, int[])
	i is the location on the squares grid
	value is the value of i
	squares is the board 
*/

function CalculateMoves(i,value,squares){

	//calculate board position of the piece
	var x = i%8;
	var y = (i-x)/8;

	var moveArray = [];

	//white = true && white < 10
	//black = false && black > 10

	var color = true; 	// initially assumes that the piece is white
	if(value >= 10){	// the piece color is white
		color = false;
	}

	//pawn = 1
	//knight = 2
	//bishop = 3
	//rook = 4
	//queen = 5
	//king = 6
	if(value === 1 || value === 11){ // pawn
		moveArray = CalculatePawnMoves(x,y,color,i,value,squares);
	}
	else if(value === 2 || value === 12){ // knight
		moveArray = CalculateKnightMoves(x,y,color,i,value,squares);
	}
	else if(value === 3 || value === 13){ // bishop
		moveArray = CalculateBishopMoves(x,y,color,squares);
	}
	else if(value === 4 || value === 14){ // rook
		moveArray = CalculateRookMoves(x,y,color,squares);
	}
	else if(value === 5 || value === 15){ // queen
		moveArray = CalculateQueenMoves(x,y,color,squares);
	}
	else if(value === 6 || value === 16){
		moveArray = CalculateKingMoves(x,y,color,squares);
	}

	moveArray = arrayUnique(moveArray);

	//checks to see if each move wont put the player in check
	var move;
	var squaresCopy;
	var moveArrayValidated = [];
	console.log("before",moveArray);

	for(var m in moveArray){						// loops through the moveArray
		move = moveArray[m];						// gets a copy of the move
		squaresCopy = squares.slice();				// creates a copy of squares
		squaresCopy[move] = value;					// makes the move 
		squaresCopy[i] = 0;
		console.log(m, moveArrayValidated, squaresCopy[move], CalculateCheck(squaresCopy,CalculateAllAttacksForOppositeColor(squaresCopy,color),color));
		// tests to see if the move is made, that it doesn't put the player in check
		if(!CalculateCheck(squaresCopy,CalculateAllAttacksForOppositeColor(squaresCopy,color),color)){
			moveArrayValidated.push(move);			// if the move would put the player in check 
													// then remove it from the list
		}

	}
	console.log("after",moveArrayValidated);

	return moveArrayValidated;
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
