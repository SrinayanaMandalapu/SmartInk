import { useEffect, useRef, useState } from "react";
import API from '../api';
import { useNavigate, useParams } from 'react-router-dom';

const Whiteboard = () => {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [mode, setMode] = useState("text"); // 'text' or 'draw'
  const [penColor, setPenColor] = useState("black");
  const [penSize, setPenSize] = useState(2);
  const [title, setTitle] = useState("Untitled Document");
  const [isSaving, setIsSaving] = useState(false);
  const editableRef = useRef(null);
  const navigate = useNavigate();
  const { id } = useParams(); // Get document ID from URL if editing existing document
  
  // Existing text styling states
  const [fontSize, setFontSize] = useState("16px");
  const [fontFamily, setFontFamily] = useState("Arial");
  const [fontWeight, setFontWeight] = useState("normal");
  const [fontStyle, setFontStyle] = useState("normal");
  const [textDecoration, setTextDecoration] = useState("none");

  // Fetch existing document if ID is provided
  useEffect(() => {
    const setupCanvasAndLoad = async() => {
      const canvas = canvasRef.current;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const ctx = canvas.getContext("2d");
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.strokeStyle = penColor;
      ctx.lineWidth = penSize;
      ctxRef.current = ctx;
    };

    

    // Load existing document if we have an ID
    if (id) {
      const fetchDocument = async () => {
        try {
          const response = await API.get(`/api/documents/${id}`);
          const doc = response.data;
          console.log("Loaded document:", doc);
          console.log("Document content:", doc.content);
          
          setTitle(doc.title);
          
          // Parse the stored content
          if (doc.content) {
            const Content = JSON.parse(doc.content);
            const parsedContent = JSON.parse(Content)
            // Set text content
            if (parsedContent.text && editableRef.current) {
              editableRef.current.innerHTML = parsedContent.text || "";
            }
            
            // Load canvas content if available
            if (parsedContent.canvas && canvasRef.current) {
              const img = new Image();
              img.onload = () => {
                if (ctxRef.current){
                ctxRef.current.drawImage(img, 0, 0);
                }
              };
              img.src = parsedContent.canvas;
            }
          }
        } catch (error) {
          console.error("Error loading document:", error);
          alert("Could not load the document. Please try again.");
        }
      };
      setupCanvasAndLoad();
      fetchDocument();
    }
  }, [id, penColor, penSize]);

  // Existing drawing functions
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

  // Existing text styling functions
  const applyFontSize = (size) => {
    document.execCommand('fontSize', false, size);
  };

  const applyFontFamily = (family) => {
    document.execCommand("fontName", false, family);
  };
  
  const applyTextStyle = (command) => {
    if (command === "bold") {
      document.execCommand("bold");
    } else if (command === "italic") {
      document.execCommand("italic");
    } else if (command === "underline") {
      document.execCommand("underline");
    }
  };

  // Save document function
  const saveDocument = async () => {
    setIsSaving(true);
    
    try {
      // Get text content from the editable div
      const textContent = editableRef.current.innerHTML;
      
      // Get canvas content as data URL (for drawing)
      const canvasContent = canvasRef.current.toDataURL();
      
      // Combine both for storage
      const documentContent = {
        text: textContent,
        canvas: canvasContent
      };
      
      const payload = {
        title: title,
        content: JSON.stringify(documentContent)
      };
      
      // If id exists, update existing document, otherwise create new one
      if (id) {
        await API.put(`/api/documents/${id}`, payload);
        alert('Document updated successfully!');
      } else {
        await API.post('/api/documents', payload);
        alert('Document created successfully!');
      }
      
      navigate('/welcome');
    } catch (err) {
      console.error('Error saving document:', err);
      alert('Failed to save document. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      {/* Title and Save Bar */}
      <div style={{ 
        padding: "10px", 
        background: "#2c3e50", 
        color: "white",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <input 
          type="text" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)}
          style={{
            fontSize: "18px",
            padding: "5px 10px",
            borderRadius: "4px",
            border: "none",
            width: "300px"
          }}
          placeholder="Document Title"
        />
        <button 
          onClick={saveDocument}
          disabled={isSaving}
          style={{
            backgroundColor: "#27ae60",
            color: "white",
            padding: "8px 15px",
            borderRadius: "4px",
            border: "none",
            cursor: "pointer",
            fontWeight: "bold"
          }}
        >
          {isSaving ? "Saving..." : "Save Document"}
        </button>
      </div>

      {/* Toolbar */}
      <div style={{ padding: "13px", background: "#eee" }}>
        <label>Mode: </label>
        <select value={mode} onChange={(e) => setMode(e.target.value)}>
          <option value="text">Text</option>
          <option value="draw">Draw</option>
        </select>

        {/* Existing toolbar content */}
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
      <div style={{ position: "relative", width: "100%", height: "calc(100vh - 115px)" }}>
        {/* Typing Area */}
        <div
          ref={editableRef}
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
            overflow: "auto",
            boxSizing: "border-box",
            whiteSpace: "pre-wrap",
            wordWrap: "break-word",
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