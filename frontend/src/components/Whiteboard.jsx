import { useEffect, useRef, useState } from "react";

const Whiteboard = () => {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [mode, setMode] = useState("text"); // 'text' or 'draw'
  const [penColor, setPenColor] = useState("black");
  const [penSize, setPenSize] = useState(2);
  
  // New states for text styling
  const [fontSize, setFontSize] = useState("16px");
  const [fontFamily, setFontFamily] = useState("Arial");
  const [fontWeight, setFontWeight] = useState("normal");
  const [fontStyle, setFontStyle] = useState("normal");
  const [textDecoration, setTextDecoration] = useState("none");

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth; // Full screen width
    canvas.height = window.innerHeight; // Full screen height

    const ctx = canvas.getContext("2d");
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = penColor;
    ctx.lineWidth = penSize;
    ctxRef.current = ctx;
  }, [penColor, penSize]);

  const startDrawing = (e) => {
    if (mode !== "draw") return;
    setIsDrawing(true);
    const { offsetX, offsetY } = e.nativeEvent;
    ctxRef.current.beginPath();
    ctxRef.current.moveTo(offsetX, offsetY);
  };

  const draw = (e) => {
    if (!isDrawing || mode !== "draw") return;
    const { offsetX, offsetY } = e.nativeEvent;
    ctxRef.current.lineTo(offsetX, offsetY);
    ctxRef.current.stroke();
  };

  const stopDrawing = () => {
    if (mode !== "draw") return;
    setIsDrawing(false);
  };

  // Apply font size to selected text
  const applyFontSize = (size) => {
    document.execCommand('fontSize', false, size);
  };

  // Apply font family to selected text
  const applyFontFamily = (family) => {
    document.execCommand("fontName", false, family);
  };
  

  // Helper function to execute text style changes
  const applyTextStyle = (command) => {
    if (command === "bold") {
      document.execCommand("bold");
    } else if (command === "italic") {
      document.execCommand("italic");
    } else if (command === "underline") {
      document.execCommand("underline");
    }
  };

  return (
    <div>
      {/* Toolbar */}
      <div style={{ padding: "13px", background: "#eee" }}>
        <label>Mode: </label>
        <select value={mode} onChange={(e) => setMode(e.target.value)}>
          <option value="text">Text</option>
          <option value="draw">Draw</option>
        </select>

        {mode === "draw" && (
          <>
            <label style={{ marginLeft: "10px" }}>Color: </label>
            <input
              type="color"
              value={penColor}
              onChange={(e) => setPenColor(e.target.value)}
            />
            <label style={{ marginLeft: "10px" }}>Size: </label>
            <input
              type="range"
              min={1}
              max={10}
              value={penSize}
              onChange={(e) => setPenSize(e.target.value)}
            />
          </>
        )}

        {mode === "text" && (
          <>
            <label style={{ marginLeft: "10px" }}>Font Size: </label>
            <select
              value={fontSize}
              onChange={(e) => {
                setFontSize(e.target.value);
                applyFontSize(e.target.value);
              }}
            >
              <option value="1">12px</option>
              <option value="2">16px</option>
              <option value="3">20px</option>
              <option value="4">24px</option>
            </select>

            <label style={{ marginLeft: "10px" }}>Font Family: </label>
            <select
              value={fontFamily}
              onChange={(e) => {
                setFontFamily(e.target.value);
                applyFontFamily(e.target.value);
              }}
            >
              <option value="Arial">Arial</option>
              <option value="Times New Roman">Times New Roman</option>
              <option value="Courier New">Courier New</option>
              <option value="Verdana">Verdana</option>
              <option value="Georgia">Georgia</option>
              <option value="Tahoma">Tahoma</option>
            </select>


            
            <button onClick={() => applyTextStyle("bold")} style={{ marginLeft: "12px", padding: "8px 12px" }}>
              {fontWeight === "normal" ? "Bold" : "Normal"}
            </button>

            
            <button onClick={() => applyTextStyle("italic")} style={{ marginLeft: "12px", padding: "8px 12px" }}>
              {fontStyle === "normal" ? "Italic" : "Normal"}
            </button>

            
            <button onClick={() => applyTextStyle("underline")} style={{ marginLeft: "12px", padding: "8px 12px" }}>
              {textDecoration === "none" ? "Underline" : "Normal"}
            </button>
          </>
        )}
      </div>

      {/* Word-like container */}
      <div style={{ position: "relative", width: "100%", height: "100vh" }}>
        {/* Typing Area */}
        <div
          contentEditable
          suppressContentEditableWarning
          style={{
            padding: "40px",
            width: "1000px",
            height: "100%",
            background: "white",
            textDecoration: textDecoration,
            lineHeight: "1.6",
            zIndex: 1,
            position: "relative",
            overflow: "auto", // Allow scrolling only for typing content
            boxSizing: "border-box", // To include padding within the width and height
            whiteSpace: "pre-wrap", // To allow line breaks in the content
            wordWrap: "break-word", // To prevent horizontal overflow
          }}
        >
          <p>Start typing here like a Word document...</p>
        </div>

        {/* Drawing Canvas */}
        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: 2,
            pointerEvents: mode === "draw" ? "auto" : "none",
          }}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseOut={stopDrawing}
        />
      </div>
    </div>
  );
};

export default Whiteboard;
