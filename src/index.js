import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import wPawn from './pieces/wPawn.png';
import wBishop from './pieces/wBishop.png';
import wknight from './pieces/wKnight.png';
import wKing from './pieces/wKing.png';
import wRook from './pieces/wRook.png';
import wQueen from './pieces/wQueen.png';

import bPawn from './pieces/bPawn.png';
import bBishop from './pieces/bBishop.png';
import bknight from './pieces/bKnight.png';
import bKing from './pieces/bKing.png';
import bRook from './pieces/bRook.png';
import bQueen from './pieces/bQueen.png';





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
		<button className= {props.className} onClick={props.onClick}>
			{props.index}
			<img className = "piece" src = {props.value} alt = {props.value} />
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
	// check bounds of the x and y cordinate
	if(x >= 0 && x <=7){
		if(y >= 0 && y <=7){
			
			// if the value of the square is zero recursively call checkline
			if(squares[cord] === 0){
				if(CheckLine(x,y,xChange,yChange,color,squares) === null){
					return [cord]
				}
				return [cord].concat(CheckLine(x,y,xChange,yChange,color,squares))

			// chech to see if the last square is the opposite color
			}else{
				if(isOppositeColor(squares[cord],color)){
					return [cord]
				}
			}
		}
	}
	return -1;
}


/*
	CalculateCheck: int[], int[], bool
	loop through attacks and see if the attack causes a check
*/
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
		moveArray = CalculateKnightMoves(x,y,color,squares);
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
	for(var m in moveArray){						// loops through the moveArray
		move = moveArray[m];						// gets a copy of the move
		squaresCopy = squares.slice();				// creates a copy of squares
		squaresCopy[move] = value;					// makes the move 
		squaresCopy[i] = 0;
		// tests to see if the move is made, that it doesn't put the player in check
		if(!CalculateCheck(squaresCopy,CalculateAllAttacksForOppositeColor(squaresCopy,color),color) && move >= 0){
			moveArrayValidated.push(move);			// if the move would put the player in check 
													// then remove it from the list
		}

	}
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
			clickPiece: null,
			checkMate: false

		};
	}

	//Main Handler for clicks
	handleClick(i) {
		const squares = this.state.squares.slice();

		// calculates which turn it is supposed to be 
		// then verifies that the clicked piece can be moved
		var color = true;
		var value = squares[i];
		if(value === 0){
			value = squares[this.state.clickPiece]
		}
		if(value > 10){
			color = false;
		}


		// if a king is check mated the board cant be changed
		if(this.state.checkMate)
			return;
		


		if(this.state.CordClick){
			// if the user clicks an empty square or a square that isn't theirs
			if (squares[i] === 0 || color !== this.state.WhiteTurn) 
				return;
			this.moveArray = CalculateMoves(i,squares[i],squares);
			this.setState({clickPiece: i});
			console.log("Moves", this.moveArray);

		}else{
			console.log("Clicked", i);
			value = squares[this.state.clickPiece];

			for(const l in this.moveArray){											// loops through the move array
				if(i === this.moveArray[l]){										// if the clicked square is in the move array 

					//auto queen handling, 
					if((value === 1 || value === 11) && (i-8 < 0 || i + 8 > 63 )){  // checks to see if a pawn has gotten to the back rank
						squares[i] = squares[this.state.clickPiece] + 4;
					}else{															// otherwise move normally
						squares[i] = squares[this.state.clickPiece];
					}

					squares[this.state.clickPiece] = 0;								// set the previous square to empty
					
					this.setState({	
						WhiteTurn: !this.state.WhiteTurn							// invert the turn
					})
				}
			}
		}
		
		// checkmate handling
		var checkmate = true;
		for(var s in squares){												// loop through every square
			if(isOppositeColor(squares[s],this.state.WhiteTurn)){							// if the square is an opposite color to the one playing
				if(CalculateMoves(s,squares[s],squares).length !== 0){		// check to see if any moves can be made 
					checkmate = false;										// if there are moves, then the user isn't checkmated
				}
			}
		}

		this.setState({														// sets the game state
			squares: squares,												// copys the new board into state
			CordClick: !this.state.CordClick,								// inverts click type
			checkMate: checkmate,											// copys checkmate to state

		});
	}

	//reloads the page, reseting the board
	resetBoard(){
		window.location.reload()
	}

	// renders the pieces based on their value
	renderPiece(i){
		//pawn = 1
		//knight = 2
		//bishop = 3
		//rook = 4
		//queen = 5
		//king = 6

		//below 10 = white
		//above 10 = black

		switch(this.state.squares[i]){
			case(1):
				return wPawn;
			case(2):
				return wknight;
			case(3):
				return wBishop;
			case(4):
				return wRook;
			case(5):
				return wQueen;
			case(6):
				return wKing;
			case(11):
				return bPawn;
			case(12):
				return bknight;
			case(13):
				return bBishop;
			case(14):
				return bRook;
			case(15):
				return bQueen;
			case(16):
				return bKing;
			default:
				return;
		}
	}
	//Render a light square
	//displayes the corresponding piece
	renderSquare(i,className) {
		return (
		
			<Square
			className = {className}
			value={this.renderPiece(i)}
			index={i} 
			onClick={() => this.handleClick(i)}
			/>

		);
	}
	render() {
		//Status strings that are displayed above the board
		let status = (this.state.WhiteTurn ? 'White' : 'Black');
		var instruction = (this.state.CordClick ? 'Choose a Piece' : 'Move the Piece');
		if(this.state.checkMate) instruction = "Check Mate";
		
		//renderSquare(i) renders a light square
		//renderSquare(i) renders a dard square
		return (
			<div>
				<div className="status">{status}</div>
				<div className="instruction">{instruction}</div>
				<div className="board-row">
					{this.renderSquare(0,"SquareLight")}
					{this.renderSquare(1,"SquareDark")}
					{this.renderSquare(2,"SquareLight")}
					{this.renderSquare(3,"SquareDark")}
					{this.renderSquare(4,"SquareLight")}
					{this.renderSquare(5,"SquareDark")}
					{this.renderSquare(6,"SquareLight")}
					{this.renderSquare(7,"SquareDark")}
				</div>
				<div className="board-row">
					{this.renderSquare(0+8,"SquareDark")}
					{this.renderSquare(1+8,"SquareLight")}
					{this.renderSquare(2+8,"SquareDark")}
					{this.renderSquare(3+8,"SquareLight")}
					{this.renderSquare(4+8,"SquareDark")}
					{this.renderSquare(5+8,"SquareLight")}
					{this.renderSquare(6+8,"SquareDark")}
					{this.renderSquare(7+8,"SquareLight")}
				</div>
				<div className="board-row">
					{this.renderSquare(0+16,"SquareLight")}
					{this.renderSquare(1+16,"SquareDark")}
					{this.renderSquare(2+16,"SquareLight")}
					{this.renderSquare(3+16,"SquareDark")}
					{this.renderSquare(4+16,"SquareLight")}
					{this.renderSquare(5+16,"SquareDark")}
					{this.renderSquare(6+16,"SquareLight")}
					{this.renderSquare(7+16,"SquareDark")}
				</div>
				<div className="board-row">
					{this.renderSquare(0+24,"SquareDark")}
					{this.renderSquare(1+24,"SquareLight")}
					{this.renderSquare(2+24,"SquareDark")}
					{this.renderSquare(3+24,"SquareLight")}
					{this.renderSquare(4+24,"SquareDark")}
					{this.renderSquare(5+24,"SquareLight")}
					{this.renderSquare(6+24,"SquareDark")}
					{this.renderSquare(7+24,"SquareLight")}
				</div>
				<div className="board-row">
					{this.renderSquare(0+32,"SquareLight")}
					{this.renderSquare(1+32,"SquareDark")}
					{this.renderSquare(2+32,"SquareLight")}
					{this.renderSquare(3+32,"SquareDark")}
					{this.renderSquare(4+32,"SquareLight")}
					{this.renderSquare(5+32,"SquareDark")}
					{this.renderSquare(6+32,"SquareLight")}
					{this.renderSquare(7+32,"SquareDark")}
				</div>
				<div className="board-row">
					{this.renderSquare(0+40,"SquareDark")}
					{this.renderSquare(1+40,"SquareLight")}
					{this.renderSquare(2+40,"SquareDark")}
					{this.renderSquare(3+40,"SquareLight")}
					{this.renderSquare(4+40,"SquareDark")}
					{this.renderSquare(5+40,"SquareLight")}
					{this.renderSquare(6+40,"SquareDark")}
					{this.renderSquare(7+40,"SquareLight")}
				</div>
				<div className="board-row">
					{this.renderSquare(0+48,"SquareLight")}
					{this.renderSquare(1+48,"SquareDark")}
					{this.renderSquare(2+48,"SquareLight")}
					{this.renderSquare(3+48,"SquareDark")}
					{this.renderSquare(4+48,"SquareLight")}
					{this.renderSquare(5+48,"SquareDark")}
					{this.renderSquare(6+48,"SquareLight")}
					{this.renderSquare(7+48,"SquareDark")}
				</div>
				<div className="board-row">
					{this.renderSquare(0+56,"SquareDark")}
					{this.renderSquare(1+56,"SquareLight")}
					{this.renderSquare(2+56,"SquareDark")}
					{this.renderSquare(3+56,"SquareLight")}
					{this.renderSquare(4+56,"SquareDark")}
					{this.renderSquare(5+56,"SquareLight")}
					{this.renderSquare(6+56,"SquareDark")}
					{this.renderSquare(7+56,"SquareLight")}
				</div>
				<div className="reset" onClick = {() => this.resetBoard()}> {"Reset Board"} </div>
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
