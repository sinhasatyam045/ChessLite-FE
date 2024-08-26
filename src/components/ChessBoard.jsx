// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import "./ChessBoard.styles.css";
import io from "socket.io-client";

const socket = io.connect("http://localhost:3005");

const ChessBoard = () => {
  const initialBoard = [
    ["A-P1", "A-P2", "A-H1", "A-H2", "A-P3"],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["B-P1", "B-P2", "B-H1", "B-H2", "B-P3"],
  ];

  const [board, setBoard] = useState(initialBoard);
  const [selectedPiece, setSelectedPiece] = useState(null);

  useEffect(() => {
    const handleMove = (data) => {
      setBoard(data.updatedBoard); // Update board with received state
    };

    socket.on("updated_board", handleMove);

    return () => socket.off("updated_board", handleMove);
  }, [socket]);

  const handleSquareClick = (row, col) => {
    if (selectedPiece) {
      socket.emit("make_move", { selectedPiece, position: [row, col], board });
      setSelectedPiece(null);
    } else if (board[row][col] !== "") {
      setSelectedPiece([row, col]);
    }
  };

  return (
    <div className="chessboard">
      {board.map((row, rowIndex) =>
        row.map((piece, colIndex) => (
          <div
            key={`${rowIndex}-${colIndex}`}
            onClick={() => handleSquareClick(rowIndex, colIndex)}
            className={`square ${piece ? "bg-gray-500" : ""}`}
          >
            {piece}
          </div>
        ))
      )}
    </div>
  );
};

export default ChessBoard;
